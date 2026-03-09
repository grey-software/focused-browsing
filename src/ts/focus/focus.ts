/**
 * Content script entry point — injected into every tab by the background worker.
 *
 * Lifecycle:
 *   1. Keyboard listeners attach synchronously at parse time (before initialize)
 *      so no keypress is missed during the async init phase.
 *   2. initialize() reads storage, creates managers and a site-specific controller,
 *      and sets up storage-change listeners.
 *   3. render() applies the current focus mode to the page via the controller.
 *
 * State is shared with the background context via chrome.storage.local — the
 * content script delegates to AppStateManager which does read-before-write to
 * avoid races.
 */
import LinkedInController from '../websites/linkedin/linkedin-controller'
import YoutubeController from '../websites/youtube/youtube-controller'
import XController from '../websites/x/x-controller'
import { getFromLocalStorage, setInLocalStorage } from '../storage'
import AppStateManager from './app-state-manager'
import { browser } from 'webextension-polyfill-ts'
import WebsiteController from '../websites/website-controller'
import KeyPressManager from './keypress-manager'
import { FocusMode, Website } from './types'
import {
  isLinkedInURL,
  isYouTubeURL,
  isXURL,
  WebsiteToggles,
  DEFAULT_WEBSITE_TOGGLES,
  WebsiteLoadingState,
  PendingReload,
  logWebsiteDetection,
  logToggleChange
} from '../websites/website-config'

let currentWebsite: Website = Website.Unsupported
let stateManager: AppStateManager
let keyPressManager: KeyPressManager
let websiteController: WebsiteController | null = null

/** Resets all global state for testing purposes. */
export function resetGlobalState() {
  currentWebsite = Website.Unsupported;
  stateManager = undefined as any;
  keyPressManager = undefined as any;
  websiteController = null;
}

// Registered synchronously at module evaluation, before the async initialize()
// call below. Attaching early ensures the LShift+RShift shortcut isn't missed
// during the brief window while storage and DOM state are still loading.
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

/** Routes keyboard events to the appropriate keydown/keyup handler. */
async function handleKeyEvent(e: KeyboardEvent) {
  // Ignore events that arrive before initialize() has set up keyPressManager.
  if (!keyPressManager) return

  if (e.type === 'keydown') {
    await handleKeyDown(e);
  } else if (e.type === 'keyup') {
    handleKeyUp();
  }
}

/** Checks for the focus mode shortcut (LShift+RShift) and toggles if the website is enabled. */
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

/** Resets the key press tracker on key release. */
function handleKeyUp(): void {
  keyPressManager.reset();
}

/** Checks whether the current website has its toggle enabled in storage. */
async function isWebsiteEnabledForKeypress(): Promise<boolean> {
  const settings = await getFromLocalStorage('websiteToggles');
  const websiteToggles: WebsiteToggles = { ...DEFAULT_WEBSITE_TOGGLES, ...settings };

  return (currentWebsite === Website.LinkedIn && websiteToggles.linkedin) ||
         (currentWebsite === Website.Youtube && websiteToggles.youtube) ||
         (currentWebsite === Website.X && websiteToggles.x);
}

const DEFAULT_CYCLE: FocusMode[] = [FocusMode.Focused, FocusMode.Unfocused]
const CUSTOM_FOCUS_CYCLE: FocusMode[] = [FocusMode.Focused, FocusMode.CustomFocus, FocusMode.Unfocused]

/** Returns the focus mode cycle for the current website based on custom focus settings. */
async function getFocusCycle(): Promise<FocusMode[]> {
  if (currentWebsite !== Website.LinkedIn && currentWebsite !== Website.X) return DEFAULT_CYCLE
  const settings = await getFromLocalStorage('websiteToggles')
  const websiteToggles: WebsiteToggles = settings || DEFAULT_WEBSITE_TOGGLES
  if (currentWebsite === Website.LinkedIn) {
    return websiteToggles.linkedinCustomFocus ? CUSTOM_FOCUS_CYCLE : DEFAULT_CYCLE
  }
  return websiteToggles.xCustomFocus ? CUSTOM_FOCUS_CYCLE : DEFAULT_CYCLE
}

/** Advances the focus mode to the next state in the cycle and re-renders. */
export async function toggleFocusMode() {
  const cycle = await getFocusCycle()
  await stateManager.updateFocusMode(currentWebsite, cycle)
  const newMode = stateManager.getFocusMode(currentWebsite);
  console.log(`Toggling focus mode to: ${FocusMode[newMode]}`);
  render()
}

/** Renders the current focus mode by dispatching to the website controller. */
export function render() {
  console.log('Rendering focus mode...');
  if (currentWebsite != Website.Unsupported && websiteController) {
    let mode = stateManager.getFocusMode(currentWebsite)
    websiteController.renderFocusMode(mode)
  }
}

/** Checks for a pending disabled-to-enabled reload and returns the reloaded website, if any. */
async function handleReloadDetection(): Promise<Website | null> {
  const pendingReload: PendingReload | null = await getFromLocalStorage('pendingReload');
  // 10s stale window: if the reload took longer than this, treat the flag as
  // leftover from a previous session and discard it.
  if (!pendingReload) return null;
  if ((Date.now() - pendingReload.timestamp) >= 10000) {
    await setInLocalStorage('pendingReload', null);
    return null;
  }

  console.log(`Detected reload after enabling ${pendingReload.website} from disabled state`);
  
  const websiteMap: Record<string, Website> = {
    linkedin: Website.LinkedIn,
    youtube: Website.Youtube,
    x: Website.X,
  };
  const reloadedWebsite = websiteMap[pendingReload.website];
  if (!reloadedWebsite) {
    console.log(`Unknown pending reload website: "${pendingReload.website}", ignoring`);
    await setInLocalStorage('pendingReload', null);
    return null;
  }

  await setInLocalStorage('websiteLoading', {
    website: pendingReload.website,
    timestamp: Date.now()
  } as WebsiteLoadingState);

  await setInLocalStorage('pendingReload', null);
  await setInLocalStorage('websiteLoading', null);

  return reloadedWebsite;
}

/** Creates the AppStateManager and KeyPressManager if not already initialized. */
async function initializeManagers(): Promise<void> {
  if (!stateManager) {
    const appState = await getFromLocalStorage('appState');
    stateManager = new AppStateManager(appState);
    keyPressManager = new KeyPressManager();
  }
}

/** Detects the current website from the URL and creates the appropriate controller if enabled. */
async function detectAndCreateController(reloadedWebsite: Website | null): Promise<void> {
  const settings = await getFromLocalStorage('websiteToggles');
  const websiteToggles: WebsiteToggles = { ...DEFAULT_WEBSITE_TOGGLES, ...settings };

  console.log('Initial website toggles:', websiteToggles);
  console.log('Current URL:', document.URL);

  const websiteMappings = [
    { domains: ['linkedin.com'], controller: LinkedInController, website: Website.LinkedIn, enabled: websiteToggles.linkedin },
    { domains: ['youtube.com'], controller: YoutubeController, website: Website.Youtube, enabled: websiteToggles.youtube },
    { domains: ['x.com', 'twitter.com'], controller: XController, website: Website.X, enabled: websiteToggles.x },
  ];

  let hostname: string
  try {
    hostname = new URL(document.URL).hostname.replace(/^www\./, '')
  } catch {
    return
  }

  for (const mapping of websiteMappings) {
    const matches = mapping.domains.some(d => hostname === d || hostname.endsWith('.' + d))
    if (matches) {
      
      if (mapping.enabled) {
        websiteController = new mapping.controller();
        currentWebsite = mapping.website;
        logWebsiteDetection(Website[currentWebsite], true, true);

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

/** Listens for websiteToggles storage changes to handle enable/disable and custom focus transitions. */
function setupStorageListeners(): void {
  // Always listen for website toggle changes, regardless of current state
  browser.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local' && changes.websiteToggles) {
      const newToggles: WebsiteToggles = { ...DEFAULT_WEBSITE_TOGGLES, ...changes.websiteToggles.newValue };
      const currentURL = document.URL;
      
      const isLinkedin = isLinkedInURL(currentURL);
      const isYoutube = isYouTubeURL(currentURL);
      const isX = isXURL(currentURL);

      if (!isLinkedin && !isYoutube && !isX) return; // Not a supported website

      const website = isLinkedin ? 'linkedin' : isYoutube ? 'youtube' : 'x';
      const websiteEnum = isLinkedin ? Website.LinkedIn : isYoutube ? Website.Youtube : Website.X;
      const isEnabled = isLinkedin ? newToggles.linkedin : isYoutube ? newToggles.youtube : newToggles.x;
      
      logToggleChange(website, isEnabled, websiteController !== null, Website[currentWebsite]);

      await handleWebsiteToggleChange(website, websiteEnum, isEnabled);

      // If custom focus was toggled off while in CustomFocus state, revert to Focused
      if (stateManager && stateManager.getFocusMode(currentWebsite) === FocusMode.CustomFocus) {
        const shouldRevert =
          (isLinkedin && !newToggles.linkedinCustomFocus) ||
          (isX && !newToggles.xCustomFocus);
        if (shouldRevert) {
          await stateManager.setFocusMode(currentWebsite, FocusMode.Focused);
          render();
        }
      }
    }
  });
}

/** Entry point: detects the website, creates managers and controller, and sets up listeners. */
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

/** Handles a website being toggled on or off: reloads for enable, cleans up for disable. */
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
    
    websiteController = null;
    currentWebsite = Website.Unsupported;
  }
}

/** Sets a pending reload flag and reloads the page for a disabled-to-enabled transition. */
async function triggerReloadForWebsite(website: string) {
  await setInLocalStorage('websiteLoading', {
    website: website,
    timestamp: Date.now()
  });

  await setInLocalStorage('pendingReload', {
    website: website,
    timestamp: Date.now(),
    reason: 'disabled-to-enabled'
  });

  window.location.reload();
}

(async function () {
  await initialize()
  render()
})()
