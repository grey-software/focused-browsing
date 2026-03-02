import { browser } from 'webextension-polyfill-ts';
import { SIZE_MAP, SizeKey } from '../ts/utils';

document.addEventListener('DOMContentLoaded', async () => {
  const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
  const linkedinToggle = document.getElementById('linkedin-toggle') as HTMLInputElement;
  const linkedinCustomFocusToggle = document.getElementById('linkedin-custom-focus') as HTMLInputElement;
  const linkedinCustomFocusRow = document.getElementById('linkedin-custom-focus-row') as HTMLElement;
  const youtubeToggle = document.getElementById('youtube-toggle') as HTMLInputElement;
  const sizeOptions = document.querySelectorAll('.size-option') as NodeListOf<HTMLButtonElement>;
  const fontSizeRow = document.getElementById('font-size-row') as HTMLElement;

  const settings = await browser.storage.local.get(['showQuote', 'textSize', 'websiteToggles']);
  const showQuote = settings.showQuote !== false;
  const textSize = settings.textSize || 'medium';
  const websiteToggles = settings.websiteToggles || { linkedin: true, youtube: true };
  
  showQuoteCheckbox.checked = showQuote;
  linkedinToggle.checked = websiteToggles.linkedin;
  linkedinCustomFocusToggle.checked = websiteToggles.linkedinCustomFocus || false;
  updateCustomFocusRowState(websiteToggles.linkedin);
  youtubeToggle.checked = websiteToggles.youtube;
  
  updateActiveSizeOption(textSize);
  updateSizeRowState(showQuote);

  showQuoteCheckbox.addEventListener('change', () => {
    const checked = showQuoteCheckbox.checked;
    browser.storage.local.set({ showQuote: checked });
    updateSizeRowState(checked);
  });

  // Save website toggle settings with immediate action but debounced UI
  let linkedinTimeout: number | null = null;
  let youtubeTimeout: number | null = null;
  
  /** Persists a website toggle change to storage with debounced loading UI. */
  const updateWebsiteToggle = async (website: 'linkedin' | 'youtube', enabled: boolean, toggleElement: HTMLInputElement) => {
    const isLinkedin = website === 'linkedin';
    const currentTimeout = isLinkedin ? linkedinTimeout : youtubeTimeout;
    const toggleContainer = toggleElement.closest('.toggle') as HTMLElement;
    
    // Prevent multiple rapid clicks on the same toggle
    if (toggleContainer.classList.contains('loading')) {
      console.log(`${website} toggle already processing, ignoring click`);
      return;
    }
    
    // Clear any pending timeout for this specific toggle
    if (currentTimeout) {
      clearTimeout(currentTimeout);
      if (isLinkedin) {
        linkedinTimeout = null;
      } else {
        youtubeTimeout = null;
      }
    }
    
    console.log(`Updating ${website} toggle to: ${enabled}`);
    
    // Disabled → enabled requires a page reload because the content script was
    // never injected for a disabled site. focus.ts reads the pendingReload flag
    // on the next load and sets the initial mode to Focused.
    const current = await browser.storage.local.get(['websiteToggles']);
    const websiteToggles = current.websiteToggles || { linkedin: true, youtube: true };
    const wasDisabled = !websiteToggles[website];
    const isEnabling = enabled;
    const isDisabledToEnabled = wasDisabled && isEnabling;
    
    try {
      websiteToggles[website] = enabled;
      await browser.storage.local.set({ websiteToggles });
      console.log(`Storage updated for ${website}:`, websiteToggles);
    } catch (error) {
      console.error('Failed to update website toggle:', error);
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

      if (isLinkedin) {
        linkedinTimeout = null;
      } else {
        youtubeTimeout = null;
      }
    }, loadingDuration);
    
    if (isLinkedin) {
      linkedinTimeout = timeout;
    } else {
      youtubeTimeout = timeout;
    }
  };
  
  linkedinToggle.addEventListener('change', () => {
    updateWebsiteToggle('linkedin', linkedinToggle.checked, linkedinToggle);
    updateCustomFocusRowState(linkedinToggle.checked);
  });

  linkedinCustomFocusToggle.addEventListener('change', async () => {
    // Capture pre-change value; if the storage write fails, roll back the checkbox.
    const previousValue = !linkedinCustomFocusToggle.checked;
    try {
      const current = await browser.storage.local.get(['websiteToggles']);
      const toggles = current.websiteToggles || { linkedin: true, youtube: true };
      toggles.linkedinCustomFocus = linkedinCustomFocusToggle.checked;
      await browser.storage.local.set({ websiteToggles: toggles });
    } catch (error) {
      console.error('Failed to update custom focus toggle:', error);
      linkedinCustomFocusToggle.checked = previousValue;
    }
  });

  youtubeToggle.addEventListener('change', () => {
    updateWebsiteToggle('youtube', youtubeToggle.checked, youtubeToggle);
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
