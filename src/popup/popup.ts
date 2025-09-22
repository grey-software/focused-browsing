import { browser } from 'webextension-polyfill-ts';
import { SIZE_MAP, SizeKey } from '../ts/utils';

document.addEventListener('DOMContentLoaded', async () => {
  const showQuoteCheckbox = document.getElementById('show-quote') as HTMLInputElement;
  const linkedinToggle = document.getElementById('linkedin-toggle') as HTMLInputElement;
  const youtubeToggle = document.getElementById('youtube-toggle') as HTMLInputElement;
  const sizeOptions = document.querySelectorAll('.size-option') as NodeListOf<HTMLButtonElement>;
  const fontSizeRow = document.getElementById('font-size-row') as HTMLElement;

  // Load settings
  const settings = await browser.storage.local.get(['showQuote', 'textSize', 'websiteToggles']);
  const showQuote = settings.showQuote !== false;
  const textSize = settings.textSize || 'medium';
  const websiteToggles = settings.websiteToggles || { linkedin: true, youtube: true };
  
  showQuoteCheckbox.checked = showQuote;
  linkedinToggle.checked = websiteToggles.linkedin;
  youtubeToggle.checked = websiteToggles.youtube;
  
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

  // Save website toggle settings with immediate action but debounced UI
  let linkedinTimeout: number | null = null;
  let youtubeTimeout: number | null = null;
  
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
    
    // Check if this toggle was previously off (disabled) and is now being enabled
    const current = await browser.storage.local.get(['websiteToggles']);
    const websiteToggles = current.websiteToggles || { linkedin: true, youtube: true };
    const wasDisabled = !websiteToggles[website];
    const isEnabling = enabled;
    const isDisabledToEnabled = wasDisabled && isEnabling;
    
    // Immediately update storage and trigger focus change (no delay)
    try {
      websiteToggles[website] = enabled;
      await browser.storage.local.set({ websiteToggles });
      console.log(`Storage updated for ${website}:`, websiteToggles);
    } catch (error) {
      console.error('Failed to update website toggle:', error);
      return;
    }
    
    // Show loading state for this specific toggle
    toggleContainer.classList.add('loading');
    
    // Use longer loading time if this is a disabled-to-enabled transition (page will reload)
    const loadingDuration = isDisabledToEnabled ? 2500 : 350;
    console.log(`${website} toggle loading duration: ${loadingDuration}ms (disabled-to-enabled: ${isDisabledToEnabled})`);
    
    // Set timeout for UI cleanup
    const timeout = window.setTimeout(() => {
      // Remove loading state after UI debounce
      toggleContainer.classList.remove('loading');
      console.log(`${website} toggle loading complete`);
      
      // Clear the timeout reference
      if (isLinkedin) {
        linkedinTimeout = null;
      } else {
        youtubeTimeout = null;
      }
    }, loadingDuration);
    
    // Store the timeout reference
    if (isLinkedin) {
      linkedinTimeout = timeout;
    } else {
      youtubeTimeout = timeout;
    }
  };
  
  linkedinToggle.addEventListener('change', () => {
    updateWebsiteToggle('linkedin', linkedinToggle.checked, linkedinToggle);
  });

  youtubeToggle.addEventListener('change', () => {
    updateWebsiteToggle('youtube', youtubeToggle.checked, youtubeToggle);
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
