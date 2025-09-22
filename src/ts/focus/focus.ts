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
let websiteController: WebsiteController

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
  if (currentWebsite != Website.Unsupported) {
    let mode = stateManager.getFocusMode(currentWebsite)
    websiteController.renderFocusMode(mode)
  }
}

export async function initialize() {
  console.log('Initializing focus script...');
  
  // Check website toggles before initializing controllers
  const settings = await FocusUtils.getFromLocalStorage('websiteToggles');
  const websiteToggles = settings || { linkedin: true, youtube: true };
  
  const websiteMappings = {
    'linkedin.com': { controller: LinkedInController, website: Website.LinkedIn, enabled: websiteToggles.linkedin },
    'youtube.com': { controller: YoutubeController, website: Website.Youtube, enabled: websiteToggles.youtube },
  };

  const currentURL = document.URL;

  for (const domain in websiteMappings) {
    if (currentURL.includes(domain)) {
      const mapping = websiteMappings[domain as keyof typeof websiteMappings];
      
      // Only initialize if the website is enabled
      if (mapping.enabled) {
        websiteController = new mapping.controller();
        currentWebsite = mapping.website;
        console.log(`Detected website: ${Website[currentWebsite]} (enabled)`);
      } else {
        console.log(`Detected website: ${Website[mapping.website]} (disabled)`);
        return; // Exit early if disabled
      }
      break;
    }
  }

  if (currentWebsite !== Website.Unsupported) {
    const appState = await FocusUtils.getFromLocalStorage('appState');
    stateManager = new AppStateManager(appState);
    keyPressManager = new KeyPressManager();
  } else {
    console.log('Unsupported website.');
  }

  // Always listen for website toggle changes, regardless of current state
  browser.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local' && changes.websiteToggles) {
      const newToggles = changes.websiteToggles.newValue;
      const currentURL = document.URL;
      
      const isLinkedin = currentURL.includes('linkedin.com');
      const isYoutube = currentURL.includes('youtube.com');
      
      console.log('Website toggles changed:', newToggles);
      
      // Handle LinkedIn focus state change
      if (isLinkedin) {
        if (!websiteController && (newToggles.linkedin !== undefined)) {
          // Initialize controller if it doesn't exist and we have a toggle state
          console.log('LinkedIn - initializing controller');
          websiteController = new LinkedInController();
          currentWebsite = Website.LinkedIn;
          
          // Initialize state manager if not already done
          if (!stateManager) {
            const appState = await FocusUtils.getFromLocalStorage('appState');
            stateManager = new AppStateManager(appState);
            keyPressManager = new KeyPressManager();
          }
        }
        
        if (websiteController && currentWebsite === Website.LinkedIn && stateManager) {
          // Update the stored state to match toggle and apply the mode
          const newMode = newToggles.linkedin ? FocusMode.Focused : FocusMode.Unfocused;
          await stateManager.setFocusMode(currentWebsite, newMode);
          
          // Apply focus/unfocus based on the new mode
          console.log(`LinkedIn toggle ${newToggles.linkedin ? 'ON' : 'OFF'} - applying ${FocusMode[newMode]} mode`);
          websiteController.renderFocusMode(newMode);
        }
      }
      
      // Handle YouTube focus state change  
      if (isYoutube) {
        if (!websiteController && (newToggles.youtube !== undefined)) {
          // Initialize controller if it doesn't exist and we have a toggle state
          console.log('YouTube - initializing controller');
          websiteController = new YoutubeController();
          currentWebsite = Website.Youtube;
          
          // Initialize state manager if not already done
          if (!stateManager) {
            const appState = await FocusUtils.getFromLocalStorage('appState');
            stateManager = new AppStateManager(appState);
            keyPressManager = new KeyPressManager();
          }
        }
        
        if (websiteController && currentWebsite === Website.Youtube && stateManager) {
          // Update the stored state to match toggle and apply the mode
          const newMode = newToggles.youtube ? FocusMode.Focused : FocusMode.Unfocused;
          await stateManager.setFocusMode(currentWebsite, newMode);
          
          // Apply focus/unfocus based on the new mode
          console.log(`YouTube toggle ${newToggles.youtube ? 'ON' : 'OFF'} - applying ${FocusMode[newMode]} mode`);
          websiteController.renderFocusMode(newMode);
        }
      }
    }
  });
}

(async function () {
  await initialize()
  render()
})()
