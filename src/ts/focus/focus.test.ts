import { browser } from 'webextension-polyfill-ts';
import { initialize, toggleFocusMode, render, resetGlobalState } from './focus';
import AppStateManager from './app-state-manager';
import KeyPressManager from './keypress-manager';
import LinkedInController from '../websites/linkedin/linkedin-controller';
import * as storage from '../storage';

jest.mock('webextension-polyfill-ts');
jest.mock('./app-state-manager');
jest.mock('./keypress-manager');
jest.mock('../websites/linkedin/linkedin-controller');
jest.mock('../storage');

describe('focus.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetGlobalState(); // Reset global state between tests
    document.body.innerHTML = '';
    
    // Mock storage reads so default values are used
    (storage.getFromLocalStorage as jest.Mock).mockResolvedValue(null);
  });

  describe('initialize', () => {
    it('should initialize correctly on linkedin.com', async () => {
      Object.defineProperty(document, 'URL', {
        value: 'https://linkedin.com',
        writable: true,
      });

      await initialize();

      expect(LinkedInController).toHaveBeenCalledTimes(1);
      expect(AppStateManager).toHaveBeenCalledTimes(1);
      expect(KeyPressManager).toHaveBeenCalledTimes(1);
    });
  });
});