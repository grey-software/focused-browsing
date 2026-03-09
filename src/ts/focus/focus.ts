/**
 * Content script entry point — injected into every tab by the background worker.
 *
 * Lifecycle:
 *   1. Keyboard listeners attach synchronously at parse time (before initialize)
 *      so no keypress is missed during the async init phase.
 *   2. initialize() reads storage and creates managers and a site-specific
 *      controller.
 *   3. render() applies the current focus mode to the page via the controller.
 *
 * State is shared with the background context via chrome.storage.local — the
 * content script delegates to AppStateManager which does read-before-write to
 * avoid races.
 */
import LinkedInController from '../websites/linkedin/linkedin-controller'
import YoutubeController from '../websites/youtube/youtube-controller'
import XController from '../websites/x/x-controller'
import { getFromLocalStorage } from '../storage'
import AppStateManager from './app-state-manager'
import { browser } from 'webextension-polyfill-ts'
import WebsiteController from '../websites/website-controller'
import KeyPressManager from './keypress-manager'
import { FocusMode, Website } from './types'

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

/** Checks for the focus mode shortcut (LShift+RShift) and toggles if supported. */
async function handleKeyDown(e: KeyboardEvent): Promise<void> {
  if (!keyPressManager.keyIsShortcutKey(e)) return;

  keyPressManager.setKeyPressedState(e.code, true);

  if (keyPressManager.isShortcutPressed() && currentWebsite !== Website.Unsupported) {
    console.log('Keypress shortcut triggered');
    toggleFocusMode();
  }
}

/** Resets the key press tracker on key release. */
function handleKeyUp(): void {
  keyPressManager.reset();
}

const DEFAULT_CYCLE: FocusMode[] = [FocusMode.Focused, FocusMode.Unfocused]

/** Advances the focus mode to the next state in the cycle and re-renders. */
export async function toggleFocusMode() {
  await stateManager.updateFocusMode(currentWebsite, DEFAULT_CYCLE)
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

/** Creates the AppStateManager and KeyPressManager if not already initialized. */
async function initializeManagers(): Promise<void> {
  if (!stateManager) {
    const appState = await getFromLocalStorage('appState');
    stateManager = new AppStateManager(appState);
    keyPressManager = new KeyPressManager();
  }
}

/** Detects the current website from the URL and creates the appropriate controller. */
async function detectAndCreateController(): Promise<void> {
  console.log('Current URL:', document.URL);

  const websiteMappings = [
    { domains: ['linkedin.com'], controller: LinkedInController, website: Website.LinkedIn },
    { domains: ['youtube.com'], controller: YoutubeController, website: Website.Youtube },
    { domains: ['x.com', 'twitter.com'], controller: XController, website: Website.X },
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
      websiteController = new mapping.controller();
      currentWebsite = mapping.website;
      console.log(`Detected website: ${Website[currentWebsite]} (controller initialized)`);
      break;
    }
  }

  if (currentWebsite !== Website.Unsupported) {
    console.log('Website controller initialized and ready');
  } else {
    console.log('Unsupported website');
  }
}

/** Entry point: detects the website, creates managers and controller, and sets up listeners. */
export async function initialize() {
  console.log('Initializing focus script...');

  await initializeManagers();
  await detectAndCreateController();
}

(async function () {
  await initialize()
  render()
})()
