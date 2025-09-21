import { browser } from 'webextension-polyfill-ts';
import '../html/popup.html'; // Import the HTML file to make it available to the test
import './popup'; // Import the popup script to be tested

jest.mock('webextension-polyfill-ts');

describe('popup.ts', () => {
  beforeEach(() => {
    // Reset the DOM and storage before each test
    document.body.innerHTML = '';
    const popup = document.createElement('div');
    popup.innerHTML = require('fs').readFileSync(__dirname + '/../html/popup.html', 'utf8');
    document.body.appendChild(popup);

    (browser.storage.local.get as jest.Mock).mockResolvedValue({});
    (browser.storage.local.set as jest.Mock).mockClear();
  });

  it('should load the settings from storage and initialize the UI', async () => {
    const settings = { showQuote: false, fontSize: '20' };
    (browser.storage.local.get as jest.Mock).mockResolvedValue(settings);

    // Dispatch the DOMContentLoaded event to trigger the popup script
    document.dispatchEvent(new Event('DOMContentLoaded'));

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for the async operations to complete

    const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
    const fontSizeSlider = document.getElementById('font-size') as HTMLInputElement;

    expect(showQuoteCheckbox.checked).toBe(false);
    expect(fontSizeSlider.value).toBe('20');
  });

  it('should save the showQuote setting when the checkbox is changed', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
    showQuoteCheckbox.checked = false;
    showQuoteCheckbox.dispatchEvent(new Event('change'));

    expect(browser.storage.local.set).toHaveBeenCalledWith({ showQuote: false });
  });

  it('should save the fontSize setting when the slider is changed', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const fontSizeSlider = document.getElementById('font-size') as HTMLInputElement;
    fontSizeSlider.value = '24';
    fontSizeSlider.dispatchEvent(new Event('input'));

    expect(browser.storage.local.set).toHaveBeenCalledWith({ fontSize: '24' });
  });
});
