import { browser } from 'webextension-polyfill-ts';

document.addEventListener('DOMContentLoaded', async () => {
  const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
  const fontSizeSlider = document.getElementById('font-size') as HTMLInputElement;

  // Load settings
  const settings = await browser.storage.local.get(['showQuote', 'fontSize']);
  showQuoteCheckbox.checked = settings.showQuote !== false;
  fontSizeSlider.value = settings.fontSize || '16';

  // Save settings
  showQuoteCheckbox.addEventListener('change', () => {
    browser.storage.local.set({ showQuote: showQuoteCheckbox.checked });
  });

  fontSizeSlider.addEventListener('input', () => {
    browser.storage.local.set({ fontSize: fontSizeSlider.value });
  });
});
