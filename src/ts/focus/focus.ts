import LinkedInController from '../websites/linkedin/linkedin-controller'
import YoutubeController from '../websites/youtube/youtube-controller'
import FocusUtils from './focus-utils'
import AppStateManager from './app-state-manager'
import { browser } from 'webextension-polyfill-ts'
import WebsiteController from '../websites/website-controller'
import KeyPressManager from './keypress-manager'
import { FocusMode, Website } from './types'
import {
  isLinkedInURL,
  isYouTubeURL,
  detectWebsiteFromURL,
  WebsiteToggles,
  WebsiteLoadingState,
  PendingReload,
  logWebsiteDetection,
  logToggleChange
} from '../utils'

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
  if (e.type === 'keydown') {
    await handleKeyDown(e);
  } else if (e.type === 'keyup') {
    handleKeyUp();
  }
}

async function handleKeyDown(e: KeyboardEvent): Promise<void> {
  if (!keyPressManager.keyIsShortcutKey(e)) return;
  
  keyPressManager.setKeyPressedState(e.code, true);
  
  if (keyPressManager.isShortcutPressed() && await isWebsiteEnabledForKeypress()) {
    console.log('Keypress shortcut triggered - website is enabled');
    toggleFocusMode();
  } else if (keyPressManager.isShortcutPressed()) {
    console.log('Keypress shortcut ignored - website is disabled');
  }
}

function handleKeyUp(): void {
  keyPressManager.reset();
}

async function isWebsiteEnabledForKeypress(): Promise<boolean> {
  const settings = await FocusUtils.getFromLocalStorage('websiteToggles');
  const websiteToggles: WebsiteToggles = settings || { linkedin: true, youtube: true };
  
  return (currentWebsite === Website.LinkedIn && websiteToggles.linkedin) ||
         (currentWebsite === Website.Youtube && websiteToggles.youtube);
}

const DEFAULT_CYCLE: FocusMode[] = [FocusMode.Focused, FocusMode.Unfocused]
const CUSTOM_FOCUS_CYCLE: FocusMode[] = [FocusMode.Focused, FocusMode.CustomFocus, FocusMode.Unfocused]

async function getFocusCycle(): Promise<FocusMode[]> {
  if (currentWebsite !== Website.LinkedIn) return DEFAULT_CYCLE
  const settings = await FocusUtils.getFromLocalStorage('websiteToggles')
  const websiteToggles: WebsiteToggles = settings || { linkedin: true, youtube: true }
  return websiteToggles.linkedinCustomFocus ? CUSTOM_FOCUS_CYCLE : DEFAULT_CYCLE
}

export async function toggleFocusMode() {
  const cycle = await getFocusCycle()
  await stateManager.updateFocusMode(currentWebsite, cycle)
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

// Phase 2: Broken down initialize() functions
async function handleReloadDetection(): Promise<Website | null> {
  const pendingReload: PendingReload | null = await FocusUtils.getFromLocalStorage('pendingReload');
  if (!pendingReload || (Date.now() - pendingReload.timestamp) >= 10000) {
    return null;
  }

  console.log(`Detected reload after enabling ${pendingReload.website} from disabled state`);
  
  const reloadedWebsite = pendingReload.website === 'youtube' ? Website.Youtube : Website.LinkedIn;
  
  // Set loading state for the popup to read
  await FocusUtils.setInLocalStorage('websiteLoading', {
    website: pendingReload.website,
    timestamp: Date.now()
  } as WebsiteLoadingState);
  
  // Clear the pending reload flag and loading state
  await FocusUtils.setInLocalStorage('pendingReload', null);
  await FocusUtils.setInLocalStorage('websiteLoading', null);
  
  return reloadedWebsite;
}

async function initializeManagers(): Promise<void> {
  if (!stateManager) {
    const appState = await FocusUtils.getFromLocalStorage('appState');
    stateManager = new AppStateManager(appState);
    keyPressManager = new KeyPressManager();
  }
}

async function detectAndCreateController(reloadedWebsite: Website | null): Promise<void> {
  const settings = await FocusUtils.getFromLocalStorage('websiteToggles');
  const websiteToggles: WebsiteToggles = settings || { linkedin: true, youtube: true };
  
  console.log('Initial website toggles:', websiteToggles);
  console.log('Current URL:', document.URL);

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
        logWebsiteDetection(Website[currentWebsite], true, true);
        
        // If this website was just reloaded from disabled-to-enabled, set it to focused mode
        if (reloadedWebsite && reloadedWebsite === currentWebsite && stateManager) {
          console.log(`Setting focus mode to FOCUSED for reloaded website: ${Website[reloadedWebsite]}`);
          await stateManager.setFocusMode(reloadedWebsite, FocusMode.Focused);
        }
      } else {
        logWebsiteDetection(Website[mapping.website], false, false);
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
}

function setupStorageListeners(): void {
  // Always listen for website toggle changes, regardless of current state
  browser.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local' && changes.websiteToggles) {
      const newToggles = changes.websiteToggles.newValue;
      const currentURL = document.URL;
      
      const isLinkedin = isLinkedInURL(currentURL);
      const isYoutube = isYouTubeURL(currentURL);
      
      if (!isLinkedin && !isYoutube) return; // Not a supported website
      
      const website = isLinkedin ? 'linkedin' : 'youtube';
      const websiteEnum = isLinkedin ? Website.LinkedIn : Website.Youtube;
      const isEnabled = isLinkedin ? newToggles.linkedin : newToggles.youtube;
      
      logToggleChange(website, isEnabled, websiteController !== null, Website[currentWebsite]);

      await handleWebsiteToggleChange(website, websiteEnum, isEnabled);

      // If custom focus was toggled off while in CustomFocus state, revert to Focused
      if (isLinkedin && !newToggles.linkedinCustomFocus &&
          currentWebsite === Website.LinkedIn && stateManager &&
          stateManager.getFocusMode(currentWebsite) === FocusMode.CustomFocus) {
        await stateManager.setFocusMode(currentWebsite, FocusMode.Focused);
        render();
      }
    }
  });
}

export async function initialize() {
  console.log('Initializing focus script...');
  
  // Phase 1: Handle reload detection
  const reloadedWebsite = await handleReloadDetection();
  
  // Phase 2: Initialize managers
  await initializeManagers();
  
  // Phase 3: Detect website and create controller
  await detectAndCreateController(reloadedWebsite);
  
  // Phase 4: Setup storage listeners
  setupStorageListeners();
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
