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
import FaceBookController from '../websites/facebook/facebook-controller'

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
  } else if (message.text == 'unfocus-from-ui') {
    toggleFocusMode()
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

async function toggleFocusMode() {
  await stateManager.updateFocusMode(currentWebsite)
  render()
}

function render() {
  if (currentWebsite != Website.Unsupported) {
    let mode = stateManager.getFocusMode(currentWebsite)
    websiteController.renderFocusMode(mode)
  }
}

async function initialize() {
  let currentURL = document.URL
  if (currentURL.includes('twitter.com')) {
    websiteController = new TwitterController()
    currentWebsite = Website.Twitter
  } else if (currentURL.includes('linkedin.com')) {
    websiteController = new LinkedInController()
    currentWebsite = Website.LinkedIn
  } else if (currentURL.includes('youtube.com')) {
    websiteController = new YoutubeController()
    currentWebsite = Website.Youtube
  } else if (currentURL.includes('github.com')) {
    websiteController = new GithubController()
    currentWebsite = Website.Github
  } else if (currentURL.includes('facebook.com')) {
    websiteController = new FaceBookController()
    currentWebsite = Website.FaceBook
  }

  if (currentWebsite != Website.Unsupported) {
    let appState = await FocusUtils.getFromLocalStorage('appState')
    stateManager = new AppStateManager(appState)
    keyPressManager = new KeyPressManager()
  }
}

;(async function () {
  await initialize()
  render()
})()
