import { browser } from 'webextension-polyfill-ts';
import './popup.html'; // Import the HTML file to make it available to the test

// Mock webextension-polyfill-ts
import './popup'; // Import the popup script to be tested

jest.mock('webextension-polyfill-ts');

describe('popup.ts', () => {
  beforeEach(() => {
    // Reset the DOM and storage before each test
    document.body.innerHTML = '';
    const popup = document.createElement('div');
    popup.innerHTML = require('fs').readFileSync(__dirname + '/popup.html', 'utf8');
    document.body.appendChild(popup);

    (browser.storage.local.get as jest.Mock).mockResolvedValue({});
    (browser.storage.local.set as jest.Mock).mockClear();
  });

  it('should load the settings from storage and initialize the UI', async () => {
    const settings = { showQuote: false, textSize: 'large' };
    (browser.storage.local.get as jest.Mock).mockResolvedValue(settings);

    // Dispatch the DOMContentLoaded event to trigger the popup script
    document.dispatchEvent(new Event('DOMContentLoaded'));

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for the async operations to complete

    const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
    const largeSizeOption = document.querySelector('[data-size="large"]') as HTMLButtonElement;

    expect(showQuoteCheckbox.checked).toBe(false);
    expect(largeSizeOption.classList.contains('active')).toBe(true);
  });

  it('should save the showQuote setting when the checkbox is changed', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
    showQuoteCheckbox.checked = false;
    showQuoteCheckbox.dispatchEvent(new Event('change'));

    expect(browser.storage.local.set).toHaveBeenCalledWith({ showQuote: false });
  });

  it('should save the textSize setting when a size option is clicked', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const xlargeSizeOption = document.querySelector('[data-size="xlarge"]') as HTMLButtonElement;
    xlargeSizeOption.click();

    expect(browser.storage.local.set).toHaveBeenCalledWith({ textSize: 'xlarge' });
  });

  it('should load website toggles from storage and initialize the UI', async () => {
    const settings = { websiteToggles: { linkedin: false, youtube: true } };
    (browser.storage.local.get as jest.Mock).mockResolvedValue(settings);

    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const linkedinToggle = document.getElementById('linkedin-toggle') as HTMLInputElement;
    const youtubeToggle = document.getElementById('youtube-toggle') as HTMLInputElement;

    expect(linkedinToggle.checked).toBe(false);
    expect(youtubeToggle.checked).toBe(true);
  });

  it('should default website toggles to enabled when not in storage', async () => {
    (browser.storage.local.get as jest.Mock).mockResolvedValue({});

    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const linkedinToggle = document.getElementById('linkedin-toggle') as HTMLInputElement;
    const youtubeToggle = document.getElementById('youtube-toggle') as HTMLInputElement;

    expect(linkedinToggle.checked).toBe(true);
    expect(youtubeToggle.checked).toBe(true);
  });

  it('should save linkedin toggle setting when changed', async () => {
    const currentSettings = { websiteToggles: { linkedin: true, youtube: true } };
    (browser.storage.local.get as jest.Mock).mockResolvedValue(currentSettings);

    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const linkedinToggle = document.getElementById('linkedin-toggle') as HTMLInputElement;
    linkedinToggle.checked = false;
    linkedinToggle.dispatchEvent(new Event('change'));

    // Wait for debounce delay
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(browser.storage.local.set).toHaveBeenCalledWith({ 
      websiteToggles: { linkedin: false, youtube: true } 
    });
  });

  it('should save youtube toggle setting when changed', async () => {
    const currentSettings = { websiteToggles: { linkedin: true, youtube: true } };
    (browser.storage.local.get as jest.Mock).mockResolvedValue(currentSettings);

    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const youtubeToggle = document.getElementById('youtube-toggle') as HTMLInputElement;
    youtubeToggle.checked = false;
    youtubeToggle.dispatchEvent(new Event('change'));

    // Wait for debounce delay
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(browser.storage.local.set).toHaveBeenCalledWith({ 
      websiteToggles: { linkedin: true, youtube: false } 
    });
  });
});
