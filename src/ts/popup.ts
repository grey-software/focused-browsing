import { browser } from 'webextension-polyfill-ts';

document.addEventListener('DOMContentLoaded', async () => {
  const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
  const fontSizeSlider = document.getElementById('font-size') as HTMLInputElement;
  const fontSizeValue = document.getElementById('font-size-value') as HTMLElement;
  const fontSizeRow = document.getElementById('font-size-row') as HTMLElement;

  // Load settings
  const settings = await browser.storage.local.get(['showQuote', 'fontSize']);
  const showQuote = settings.showQuote !== false;
  const fontSize = settings.fontSize || '16';
  
  showQuoteCheckbox.checked = showQuote;
  fontSizeSlider.value = fontSize;
  fontSizeValue.textContent = `${fontSize}px`;

  // Update font size row visibility
  updateFontSizeRowState(showQuote);

  // Save showQuote setting
  showQuoteCheckbox.addEventListener('change', () => {
    const checked = showQuoteCheckbox.checked;
    browser.storage.local.set({ showQuote: checked });
    updateFontSizeRowState(checked);
  });

  // Save fontSize setting and update display
  fontSizeSlider.addEventListener('input', () => {
    const value = fontSizeSlider.value;
    browser.storage.local.set({ fontSize: value });
    fontSizeValue.textContent = `${value}px`;
  });

  function updateFontSizeRowState(showQuote: boolean) {
    if (showQuote) {
      fontSizeRow.classList.remove('disabled');
      fontSizeSlider.disabled = false;
    } else {
      fontSizeRow.classList.add('disabled');
      fontSizeSlider.disabled = true;
    }
  }
});
