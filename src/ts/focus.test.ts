import { browser } from 'webextension-polyfill-ts';
import { initialize, toggleFocusMode, render } from './focus/focus';
import AppStateManager from './focus/app-state-manager';
import KeyPressManager from './focus/keypress-manager';
import LinkedInController from './websites/linkedin/linkedin-controller';

jest.mock('webextension-polyfill-ts');
jest.mock('./focus/app-state-manager');
jest.mock('./focus/keypress-manager');
jest.mock('./websites/linkedin/linkedin-controller');

describe('focus.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
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