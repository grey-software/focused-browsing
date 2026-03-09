import { browser } from 'webextension-polyfill-ts';

document.addEventListener('DOMContentLoaded', () => {
  const openOptionsButton = document.getElementById('open-options') as HTMLButtonElement | null;
  if (!openOptionsButton) return;

  openOptionsButton.addEventListener('click', async () => {
    await browser.runtime.openOptionsPage();
  });
});
