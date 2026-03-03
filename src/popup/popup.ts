import { browser } from 'webextension-polyfill-ts';
import { SIZE_MAP, SizeKey, DEFAULT_WEBSITE_TOGGLES } from '../ts/utils';

document.addEventListener('DOMContentLoaded', async () => {
  const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
  const linkedinToggle = document.getElementById('linkedin-toggle') as HTMLInputElement;
  const linkedinCustomFocusToggle = document.getElementById('linkedin-custom-focus') as HTMLInputElement;
  const linkedinCustomFocusRow = document.getElementById('linkedin-custom-focus-row') as HTMLElement;
  const youtubeToggle = document.getElementById('youtube-toggle') as HTMLInputElement;
  const xToggle = document.getElementById('x-toggle') as HTMLInputElement;
  const xCustomFocusToggle = document.getElementById('x-custom-focus') as HTMLInputElement;
  const xCustomFocusRow = document.getElementById('x-custom-focus-row') as HTMLElement;
  const sizeOptions = document.querySelectorAll('.size-option') as NodeListOf<HTMLButtonElement>;
  const fontSizeRow = document.getElementById('font-size-row') as HTMLElement;

  const settings = await browser.storage.local.get(['showQuote', 'textSize', 'websiteToggles']);
  const showQuote = settings.showQuote !== false;
  const textSize = settings.textSize || 'medium';
  const websiteToggles = settings.websiteToggles || DEFAULT_WEBSITE_TOGGLES;

  showQuoteCheckbox.checked = showQuote;
  linkedinToggle.checked = websiteToggles.linkedin;
  linkedinCustomFocusToggle.checked = websiteToggles.linkedinCustomFocus || false;
  updateCustomFocusRowState(websiteToggles.linkedin);
  youtubeToggle.checked = websiteToggles.youtube;
  xToggle.checked = websiteToggles.x !== false;
  xCustomFocusToggle.checked = websiteToggles.xCustomFocus || false;
  updateXCustomFocusRowState(websiteToggles.x !== false);

  updateActiveSizeOption(textSize);
  updateSizeRowState(showQuote);

  showQuoteCheckbox.addEventListener('change', () => {
    const checked = showQuoteCheckbox.checked;
    browser.storage.local.set({ showQuote: checked });
    updateSizeRowState(checked);
  });

  // Save website toggle settings with immediate action but debounced UI
  const toggleTimeouts = new Map<string, number>();

  /** Persists a website toggle change to storage with debounced loading UI. */
  const updateWebsiteToggle = async (website: 'linkedin' | 'youtube' | 'x', enabled: boolean, toggleElement: HTMLInputElement) => {
    const toggleContainer = toggleElement.closest('.toggle') as HTMLElement;

    // Prevent multiple rapid clicks on the same toggle
    if (toggleContainer.classList.contains('loading')) {
      console.log(`${website} toggle already processing, ignoring click`);
      return;
    }

    // Clear any pending timeout for this specific toggle
    const currentTimeout = toggleTimeouts.get(website);
    if (currentTimeout) {
      clearTimeout(currentTimeout);
      toggleTimeouts.delete(website);
    }

    console.log(`Updating ${website} toggle to: ${enabled}`);

    // Disabled → enabled requires a page reload because the content script was
    // never injected for a disabled site. focus.ts reads the pendingReload flag
    // on the next load and sets the initial mode to Focused.
    const current = await browser.storage.local.get(['websiteToggles']);
    const websiteToggles = current.websiteToggles || DEFAULT_WEBSITE_TOGGLES;
    const wasDisabled = !websiteToggles[website];
    const isEnabling = enabled;
    const isDisabledToEnabled = wasDisabled && isEnabling;

    const previousValue = websiteToggles[website];
    try {
      websiteToggles[website] = enabled;
      await browser.storage.local.set({ websiteToggles });
      console.log(`Storage updated for ${website}:`, websiteToggles);
    } catch (error) {
      console.error('Failed to update website toggle:', error);
      websiteToggles[website] = previousValue;
      toggleElement.checked = previousValue;
      return;
    }

    toggleContainer.classList.add('loading');

    // Use longer loading time ONLY for disabled-to-enabled transitions (page will reload)
    // All other cases (enabled-to-disabled, or enabled-to-enabled) use short duration
    const loadingDuration = isDisabledToEnabled ? 2500 : 350;
    console.log(`${website} toggle loading duration: ${loadingDuration}ms (disabled-to-enabled: ${isDisabledToEnabled})`);

    const timeout = window.setTimeout(() => {
      toggleContainer.classList.remove('loading');
      console.log(`${website} toggle loading complete`);
      toggleTimeouts.delete(website);
    }, loadingDuration);

    toggleTimeouts.set(website, timeout);
  };
  
  linkedinToggle.addEventListener('change', () => {
    updateWebsiteToggle('linkedin', linkedinToggle.checked, linkedinToggle);
    updateCustomFocusRowState(linkedinToggle.checked);
  });

  /** Persists a custom focus toggle change to storage with rollback on failure. */
  async function persistCustomFocusToggle(checkbox: HTMLInputElement, storageKey: 'linkedinCustomFocus' | 'xCustomFocus') {
    const previousValue = !checkbox.checked;
    try {
      const current = await browser.storage.local.get(['websiteToggles']);
      const toggles = current.websiteToggles || DEFAULT_WEBSITE_TOGGLES;
      toggles[storageKey] = checkbox.checked;
      await browser.storage.local.set({ websiteToggles: toggles });
    } catch (error) {
      console.error(`Failed to update ${storageKey} toggle:`, error);
      checkbox.checked = previousValue;
    }
  }

  linkedinCustomFocusToggle.addEventListener('change', () => {
    persistCustomFocusToggle(linkedinCustomFocusToggle, 'linkedinCustomFocus');
  });

  youtubeToggle.addEventListener('change', () => {
    updateWebsiteToggle('youtube', youtubeToggle.checked, youtubeToggle);
  });

  xToggle.addEventListener('change', () => {
    updateWebsiteToggle('x', xToggle.checked, xToggle);
    updateXCustomFocusRowState(xToggle.checked);
  });

  xCustomFocusToggle.addEventListener('change', () => {
    persistCustomFocusToggle(xCustomFocusToggle, 'xCustomFocus');
  });

  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (option.disabled) return;
      
      const size = option.dataset.size as SizeKey;
      browser.storage.local.set({ textSize: size });
      updateActiveSizeOption(size);
    });
  });

  /** Highlights the active size button and deactivates the others. */
  function updateActiveSizeOption(activeSize: string) {
    sizeOptions.forEach(option => {
      const isActive = option.dataset.size === activeSize;
      option.classList.toggle('active', isActive);
    });
  }

  /** Enables or disables the custom focus toggle row based on the LinkedIn toggle state. */
  function updateCustomFocusRowState(linkedinEnabled: boolean) {
    if (linkedinEnabled) {
      linkedinCustomFocusRow.classList.remove('disabled');
      linkedinCustomFocusToggle.disabled = false;
    } else {
      linkedinCustomFocusRow.classList.add('disabled');
      linkedinCustomFocusToggle.disabled = true;
    }
  }

  /** Enables or disables the X custom focus toggle row based on the X toggle state. */
  function updateXCustomFocusRowState(xEnabled: boolean) {
    if (xEnabled) {
      xCustomFocusRow.classList.remove('disabled');
      xCustomFocusToggle.disabled = false;
    } else {
      xCustomFocusRow.classList.add('disabled');
      xCustomFocusToggle.disabled = true;
    }
  }

  /** Enables or disables the text size selector based on the show-quote toggle state. */
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
