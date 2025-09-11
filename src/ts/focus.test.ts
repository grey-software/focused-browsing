import { browser } from 'webextension-polyfill-ts';
import { initialize, toggleFocusMode, render } from './focus/focus';
import AppStateManager from './focus/app-state-manager';
import KeyPressManager from './focus/keypress-manager';
import TwitterController from './websites/twitter/twitter-controller';

jest.mock('webextension-polyfill-ts');
jest.mock('./focus/app-state-manager');
jest.mock('./focus/keypress-manager');
jest.mock('./websites/twitter/twitter-controller');

describe('focus.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('initialize', () => {
    it('should initialize correctly on twitter.com', async () => {
      Object.defineProperty(document, 'URL', {
        value: 'https://twitter.com',
        writable: true,
      });

      await initialize();

      expect(TwitterController).toHaveBeenCalledTimes(1);
      expect(AppStateManager).toHaveBeenCalledTimes(1);
      expect(KeyPressManager).toHaveBeenCalledTimes(1);
    });
  });
});