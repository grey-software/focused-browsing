import { browser } from 'webextension-polyfill-ts';
import popupHtml from './popup.html';

import './popup'; // Import the popup script to be tested

jest.mock('webextension-polyfill-ts');

describe('popup.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const popup = document.createElement('div');
    popup.innerHTML = popupHtml;
    document.body.appendChild(popup);

    (browser.runtime.openOptionsPage as jest.Mock).mockClear();
  });

  it('renders the swiss-style info rows', () => {
    const labels = Array.from(document.querySelectorAll('.info-label')).map((el) => el.textContent?.trim());
    expect(labels).toEqual(['Sites', 'Shortcut']);
  });

  it('opens the options page from the popup button', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const button = document.getElementById('open-options') as HTMLButtonElement;
    button.click();

    await Promise.resolve();

    expect(browser.runtime.openOptionsPage).toHaveBeenCalledTimes(1);
  });
});
