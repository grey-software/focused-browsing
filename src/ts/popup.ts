import { browser } from 'webextension-polyfill-ts';
import { SIZE_MAP, SizeKey } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
  const sizeOptions = document.querySelectorAll('.size-option') as NodeListOf<HTMLButtonElement>;
  const fontSizeRow = document.getElementById('font-size-row') as HTMLElement;

  // Load settings
  const settings = await browser.storage.local.get(['showQuote', 'textSize']);
  const showQuote = settings.showQuote !== false;
  const textSize = settings.textSize || 'medium';
  
  showQuoteCheckbox.checked = showQuote;
  
  // Set active size option
  updateActiveSizeOption(textSize);
  
  // Update size row visibility
  updateSizeRowState(showQuote);

  // Save showQuote setting
  showQuoteCheckbox.addEventListener('change', () => {
    const checked = showQuoteCheckbox.checked;
    browser.storage.local.set({ showQuote: checked });
    updateSizeRowState(checked);
  });

  // Handle size option clicks
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (option.disabled) return;
      
      const size = option.dataset.size as SizeKey;
      browser.storage.local.set({ textSize: size });
      updateActiveSizeOption(size);
    });
  });

  function updateActiveSizeOption(activeSize: string) {
    sizeOptions.forEach(option => {
      const isActive = option.dataset.size === activeSize;
      option.classList.toggle('active', isActive);
    });
  }

  function updateSizeRowState(showQuote: boolean) {
    if (showQuote) {
      fontSizeRow.classList.remove('disabled');
      sizeOptions.forEach(option => option.disabled = false);
    } else {
      fontSizeRow.classList.add('disabled');
      sizeOptions.forEach(option => option.disabled = true);
    }
  }
});
