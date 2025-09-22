import LinkedInController from '../websites/linkedin/linkedin-controller'
import YoutubeController from '../websites/youtube/youtube-controller'
import FocusUtils from './focus-utils'
import AppStateManager from './app-state-manager'
import { browser } from 'webextension-polyfill-ts'
import WebsiteController from '../websites/website-controller'
import KeyPressManager from './keypress-manager'
import { FocusMode, Website } from './types'

let currentWebsite: Website = Website.Unsupported
let stateManager: AppStateManager
let keyPressManager: KeyPressManager
let websiteController: WebsiteController | null = null

// Export function for testing to reset global state
export function resetGlobalState() {
  currentWebsite = Website.Unsupported;
  stateManager = undefined as any;
  keyPressManager = undefined as any;
  websiteController = null;
}

document.addEventListener('keydown', handleKeyEvent, false)
document.addEventListener('keyup', handleKeyEvent, false)

browser.runtime.onMessage.addListener(async (message: { text: string; url: string }) => {
  // We load the latest appState from localStorage
  await stateManager.loadLatestState()
  if (message.text == 'new-tab-activated') {
    render()
    return Promise.resolve({ status: 'success' })
  } 
})

async function handleKeyEvent(e: KeyboardEvent) {
  if (e.type == 'keydown') {
    if (keyPressManager.keyIsShortcutKey(e)) {
      let keyCode = e.code
      keyPressManager.setKeyPressedState(keyCode, true)
    }
    if (keyPressManager.isShortcutPressed()) {
      // Only allow keypress toggle if the website is currently enabled
      const settings = await FocusUtils.getFromLocalStorage('websiteToggles');
      const websiteToggles = settings || { linkedin: true, youtube: true };
      
      const isWebsiteEnabled = 
        (currentWebsite === Website.LinkedIn && websiteToggles.linkedin) ||
        (currentWebsite === Website.Youtube && websiteToggles.youtube);
        
      if (isWebsiteEnabled) {
        console.log('Keypress shortcut triggered - website is enabled');
        toggleFocusMode();
      } else {
        console.log('Keypress shortcut ignored - website is disabled');
      }
    }
  }
  if (e.type == 'keyup') {
    keyPressManager.reset()
  }
}

export async function toggleFocusMode() {
  await stateManager.updateFocusMode(currentWebsite)
  const newMode = stateManager.getFocusMode(currentWebsite);
  console.log(`Toggling focus mode to: ${FocusMode[newMode]}`);
  render()
}

export function render() {
  console.log('Rendering focus mode...');
  if (currentWebsite != Website.Unsupported && websiteController) {
    let mode = stateManager.getFocusMode(currentWebsite)
    websiteController.renderFocusMode(mode)
  }
}

export async function initialize() {
  console.log('Initializing focus script...');
  
  let reloadedWebsite: Website | null = null;
  
  // Check if we're loading after a disabled-to-enabled reload
  const pendingReload = await FocusUtils.getFromLocalStorage('pendingReload');
  if (pendingReload && (Date.now() - pendingReload.timestamp) < 10000) { // Within 10 seconds
    console.log(`Detected reload after enabling ${pendingReload.website} from disabled state`);
    
    // Remember which website was reloaded so we can set it to focused mode
    reloadedWebsite = pendingReload.website === 'youtube' ? Website.Youtube : Website.LinkedIn;
    
    // Set loading state for the popup to read
    await FocusUtils.setInLocalStorage('websiteLoading', {
      website: pendingReload.website,
      timestamp: Date.now()
    });
    
    // Clear the pending reload flag
    await FocusUtils.setInLocalStorage('pendingReload', null);
    
    // Clear loading state
    await FocusUtils.setInLocalStorage('websiteLoading', null);
  }
  
  // Check website toggles before initializing controllers
  const settings = await FocusUtils.getFromLocalStorage('websiteToggles');
  const websiteToggles = settings || { linkedin: true, youtube: true };
  
  console.log('Initial website toggles:', websiteToggles);
  console.log('Current URL:', document.URL);

  // Always initialize state managers FIRST, even for disabled/unsupported sites
  // so that the storage listener can work properly when toggling sites on/off
  if (!stateManager) {
    const appState = await FocusUtils.getFromLocalStorage('appState');
    stateManager = new AppStateManager(appState);
    keyPressManager = new KeyPressManager();
  }

  const websiteMappings = {
    'linkedin.com': { controller: LinkedInController, website: Website.LinkedIn, enabled: websiteToggles.linkedin },
    'youtube.com': { controller: YoutubeController, website: Website.Youtube, enabled: websiteToggles.youtube },
  };

  const currentURL = document.URL;

  for (const domain in websiteMappings) {
    if (currentURL.includes(domain)) {
      const mapping = websiteMappings[domain as keyof typeof websiteMappings];
      
      // Only initialize controller if the website is enabled
      if (mapping.enabled) {
        websiteController = new mapping.controller();
        currentWebsite = mapping.website;
        console.log(`Detected website: ${Website[currentWebsite]} (enabled) - controller initialized`);
        
        // If this website was just reloaded from disabled-to-enabled, set it to focused mode
        if (reloadedWebsite && reloadedWebsite === currentWebsite && stateManager) {
          console.log(`Setting focus mode to FOCUSED for reloaded website: ${Website[reloadedWebsite]}`);
          await stateManager.setFocusMode(reloadedWebsite, FocusMode.Focused);
        }
      } else {
        console.log(`Detected website: ${Website[mapping.website]} (disabled) - no controller initialized`);
        currentWebsite = mapping.website; // Still set the website type so storage listener works
      }
      break;
    }
  }

  if (currentWebsite !== Website.Unsupported) {
    console.log('Website controller initialized and ready');
  } else {
    console.log('Unsupported or disabled website - listening for toggle changes');
  }

  // Always listen for website toggle changes, regardless of current state
  browser.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local' && changes.websiteToggles) {
      const newToggles = changes.websiteToggles.newValue;
      const currentURL = document.URL;
      
      const isLinkedin = currentURL.includes('linkedin.com');
      const isYoutube = currentURL.includes('youtube.com');
      
      if (!isLinkedin && !isYoutube) return; // Not a supported website
      
      const website = isLinkedin ? 'linkedin' : 'youtube';
      const websiteEnum = isLinkedin ? Website.LinkedIn : Website.Youtube;
      const isEnabled = isLinkedin ? newToggles.linkedin : newToggles.youtube;
      
      console.log(`${website} toggle changed to: ${isEnabled}`);
      console.log(`Current state - controller: ${websiteController ? 'exists' : 'null'}, website: ${Website[currentWebsite]}`);
      
      await handleWebsiteToggleChange(website, websiteEnum, isEnabled);
    }
  });
}

async function handleWebsiteToggleChange(website: string, websiteEnum: Website, isEnabled: boolean) {
  const hasController = websiteController !== null;
  const isCorrectWebsite = currentWebsite === websiteEnum;
  
  if (!hasController && isEnabled) {
    // DISABLED → ENABLED: Need to reload for content script injection
    console.log(`${website} - transitioning from DISABLED to ENABLED, triggering reload`);
    await triggerReloadForWebsite(website);
    
  } else if (hasController && isCorrectWebsite && stateManager && websiteController && !isEnabled) {
    // ENABLED → DISABLED: Instant cleanup (disable functionality entirely)
    console.log(`${website} - transitioning from ENABLED to DISABLED, cleaning up controller`);
    await stateManager.setFocusMode(websiteEnum, FocusMode.Unfocused);
    websiteController.renderFocusMode(FocusMode.Unfocused);
    
    // Clean up controller - website functionality is now disabled
    websiteController = null;
    currentWebsite = Website.Unsupported;
  }
}

async function triggerReloadForWebsite(website: string) {
  // Set loading state for popup
  await FocusUtils.setInLocalStorage('websiteLoading', {
    website: website,
    timestamp: Date.now()
  });
  
  // Set reload flag  
  await FocusUtils.setInLocalStorage('pendingReload', {
    website: website,
    timestamp: Date.now(),
    reason: 'disabled-to-enabled'
  });
  
  // Reload the page
  window.location.reload();
}

(async function () {
  await initialize()
  render()
})()
