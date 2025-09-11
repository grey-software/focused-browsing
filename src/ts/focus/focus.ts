import LinkedInController from '../websites/linkedin/linkedin-controller'
import TwitterController from '../websites/twitter/twitter-controller'
import YoutubeController from '../websites/youtube/youtube-controller'
import GithubController from '../websites/github/github-controller'
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
      toggleFocusMode()
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
  const websiteMappings = {
    'twitter.com': { controller: TwitterController, website: Website.Twitter },
    'linkedin.com': { controller: LinkedInController, website: Website.LinkedIn },
    'youtube.com': { controller: YoutubeController, website: Website.Youtube },
    'github.com': { controller: GithubController, website: Website.Github },
  };

  const currentURL = document.URL;

  for (const domain in websiteMappings) {
    if (currentURL.includes(domain)) {
      const mapping = websiteMappings[domain as keyof typeof websiteMappings];
      websiteController = new mapping.controller();
      currentWebsite = mapping.website;
      console.log(`Detected website: ${Website[currentWebsite]}`);
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
}

(async function () {
  await initialize()
  render()
})()
