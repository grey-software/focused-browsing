import { browser } from 'webextension-polyfill-ts';

document.addEventListener('DOMContentLoaded', () => {
  const openOptionsButton = document.getElementById('open-options') as HTMLButtonElement | null;
  if (!openOptionsButton) return;

  openOptionsButton.addEventListener('click', () => {
    browser.runtime.openOptionsPage().catch((error) => {
      console.error('Failed to open options page', error);
    });
  });
});
