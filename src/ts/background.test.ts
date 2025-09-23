import { browser } from 'webextension-polyfill-ts';
import { loadFocusScriptOnTabChange, checkFocusScript } from './background';

jest.mock('webextension-polyfill-ts');

describe('background.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadFocusScriptOnTabChange', () => {
    it('should load focus script on tab change', async () => {
      const tabId = 1;
      const changeInfo = { status: 'loading' };
      const tab = { url: 'https://twitter.com' };

      // Mock the atomic check-and-set to return true (should inject)
      (browser.scripting.executeScript as jest.Mock)
        .mockResolvedValueOnce([{ result: true }])   // Atomic check-and-set returns true
        .mockResolvedValueOnce(undefined);           // Focus.js injection

      await loadFocusScriptOnTabChange(tabId, changeInfo, tab as any);

      expect(browser.scripting.executeScript).toHaveBeenCalledTimes(2);
      
      // First call should be the atomic check-and-set
      expect(browser.scripting.executeScript).toHaveBeenNthCalledWith(1, {
        target: { tabId: tabId },
        func: expect.any(Function),
      });
      
      // Second call should be the actual script injection
      expect(browser.scripting.executeScript).toHaveBeenNthCalledWith(2, {
        target: { tabId: tabId },
        files: ['focus.js'],
      });
    });

    it('should not load focus script if it is already loaded', async () => {
      const tabId = 1;
      const changeInfo = { status: 'loading' };
      const tab = { url: 'https://twitter.com' };

      // Mock the atomic check-and-set to return false (already injected)
      (browser.scripting.executeScript as jest.Mock).mockResolvedValueOnce([{ result: false }]);

      await loadFocusScriptOnTabChange(tabId, changeInfo, tab as any);

      // Should only call the atomic check-and-set, not the actual injection
      expect(browser.scripting.executeScript).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkFocusScript', () => {
    it('should return true if the script is injected', async () => {
      const tabId = 1;
      (browser.tabs.get as jest.Mock).mockResolvedValue({ id: tabId, url: 'https://example.com' });
      (browser.scripting.executeScript as jest.Mock).mockResolvedValue([{ result: true }]);

      const result = await checkFocusScript(tabId);

      expect(result).toBe(true);
    });

    it('should return false if the script is not injected', async () => {
      const tabId = 1;
      (browser.tabs.get as jest.Mock).mockResolvedValue({ id: tabId, url: 'https://example.com' });
      (browser.scripting.executeScript as jest.Mock).mockResolvedValue([{ result: false }]);

      const result = await checkFocusScript(tabId);

      expect(result).toBe(false);
    });
  });

  describe('Multiple injection prevention', () => {
    it('should prevent multiple script injections when called rapidly', async () => {
      const tabId = 1;
      const changeInfo = { status: 'loading' };
      const tab = { url: 'https://youtube.com' };

      // Mock the first call to return false (not injected), then subsequent calls return true
      (browser.tabs.get as jest.Mock).mockResolvedValue({ id: tabId, url: 'https://youtube.com' });
      
      let callCount = 0;
      (browser.scripting.executeScript as jest.Mock).mockImplementation((options) => {
        if (options.func) {
          // This is either checking injection status or setting the flag
          callCount++;
          if (callCount === 1) {
            // First check - script not injected yet
            return Promise.resolve([{ result: false }]);
          } else if (callCount === 3) {
            // After injection, script should be marked as injected
            return Promise.resolve([{ result: true }]);
          } else {
            // Setting the flag
            return Promise.resolve([{ result: undefined }]);
          }
        } else {
          // This is the actual script injection
          return Promise.resolve(undefined);
        }
      });

      // Simulate rapid calls that might happen due to race conditions
      const promises = [
        loadFocusScriptOnTabChange(tabId, changeInfo, tab as any),
        loadFocusScriptOnTabChange(tabId, changeInfo, tab as any),
        loadFocusScriptOnTabChange(tabId, changeInfo, tab as any)
      ];

      await Promise.all(promises);

      // Should only inject the focus script once, not multiple times
      const focusScriptInjectionCalls = (browser.scripting.executeScript as jest.Mock).mock.calls.filter(
        call => call[0].files && call[0].files.includes('focus.js')
      );
      
      expect(focusScriptInjectionCalls.length).toBe(1);
    });

    it('should handle async script injection check race condition', async () => {
      const tabId = 1;
      const changeInfo = { status: 'loading' };
      const tab = { url: 'https://youtube.com' };

      // Mock for our new atomic approach
      let callCount = 0;
      (browser.scripting.executeScript as jest.Mock).mockImplementation((options) => {
        callCount++;
        
        if (options.func) {
          // This is our atomic check-and-set function
          if (callCount === 1) {
            // First call succeeds and claims the injection
            return Promise.resolve([{ result: true }]);
          } else {
            // Subsequent calls find it already injected
            return Promise.resolve([{ result: false }]);
          }
        } else {
          // This is the actual script injection (focus.js)
          return Promise.resolve(undefined);
        }
      });

      // Fire multiple rapid injection attempts
      const injectionPromises = Array.from({ length: 5 }, () => 
        loadFocusScriptOnTabChange(tabId, changeInfo, tab as any)
      );

      await Promise.all(injectionPromises);

      // Count how many times the focus script was actually injected
      const focusScriptInjections = (browser.scripting.executeScript as jest.Mock).mock.calls.filter(
        call => call[0].files && call[0].files.includes('focus.js')
      );

      // With our atomic approach, only one injection should succeed
      expect(focusScriptInjections.length).toBe(1);
    });
  });
});