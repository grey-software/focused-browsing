import { browser } from 'webextension-polyfill-ts';
import { injectFocusScriptOnTabChange, checkFocusScriptInjected } from './background';

jest.mock('webextension-polyfill-ts');

describe('background.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('injectFocusScriptOnTabChange', () => {
    it('should inject focus script on tab change', async () => {
      const tabId = 1;
      const changeInfo = { status: 'loading' };
      const tab = { url: 'https://twitter.com' };

      // First call to checkFocusScriptInjected returns false
      (browser.scripting.executeScript as jest.Mock)
        .mockResolvedValueOnce([{ result: false }])  // For checkFocusScriptInjected
        .mockResolvedValueOnce(undefined)  // For focus.js injection
        .mockResolvedValueOnce(undefined); // For setting isFocusScriptInjected flag

      await injectFocusScriptOnTabChange(tabId, changeInfo, tab as any);

      expect(browser.scripting.executeScript).toHaveBeenCalledTimes(3);
      expect(browser.scripting.executeScript).toHaveBeenNthCalledWith(1, {
        target: { tabId: tabId },
        func: expect.any(Function),
      });
      expect(browser.scripting.executeScript).toHaveBeenNthCalledWith(2, {
        target: { tabId: tabId },
        files: ['focus.js'],
      });
      expect(browser.scripting.executeScript).toHaveBeenNthCalledWith(3, {
        target: { tabId: tabId },
        func: expect.any(Function),
      });
    });

    it('should not inject focus script if it is already injected', async () => {
      const tabId = 1;
      const changeInfo = { status: 'loading' };
      const tab = { url: 'https://twitter.com' };

      (browser.scripting.executeScript as jest.Mock).mockResolvedValueOnce([{ result: true }]);

      await injectFocusScriptOnTabChange(tabId, changeInfo, tab as any);

      expect(browser.scripting.executeScript).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkFocusScriptInjected', () => {
    it('should return true if the script is injected', async () => {
      const tabId = 1;
      (browser.tabs.get as jest.Mock).mockResolvedValue({ id: tabId, url: 'https://example.com' });
      (browser.scripting.executeScript as jest.Mock).mockResolvedValue([{ result: true }]);

      const result = await checkFocusScriptInjected(tabId);

      expect(result).toBe(true);
    });

    it('should return false if the script is not injected', async () => {
      const tabId = 1;
      (browser.tabs.get as jest.Mock).mockResolvedValue({ id: tabId, url: 'https://example.com' });
      (browser.scripting.executeScript as jest.Mock).mockResolvedValue([{ result: false }]);

      const result = await checkFocusScriptInjected(tabId);

      expect(result).toBe(false);
    });
  });
});