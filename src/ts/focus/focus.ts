import LinkedInController from '../websites/linkedin/linkedin-controller'
import TwitterController from '../websites/twitter/twitter-controller'
import YoutubeController from '../websites/youtube/youtube-controller'
import GithubController from '../websites/github/github-controller'
import FocusUtils from './focus-utils'
import AppStateManager from './focus-state-manager'
import { browser, Runtime } from 'webextension-polyfill-ts'
import WebsiteController from '../websites/website-controller'
import KeyPressManager from './keypress-manager'
import { FocusState, Website } from './types'

let currentWebsite: Website = Website.Unsupported

let appStateManager: AppStateManager
let keyPressManager: KeyPressManager
let websiteController: WebsiteController

document.addEventListener('keydown', handleKeyEvent, false)
document.addEventListener('keyup', handleKeyEvent, false)

browser.runtime.onMessage.addListener(async (message: { text: string; url: string }) => {
  let newFocusState = await FocusUtils.getFromLocalStorage('appState')

  if (message.text == 'different tab activated') {
    if (!appStateManager.hasFocusStateChanged(newFocusState, currentWebsite)) {
      return
    }
    appStateManager.setFocusState(newFocusState)

    if (currentWebsite) {
      renderFocusState(appStateManager.appState[currentWebsite])
    }

    return Promise.resolve({ status: 'tab change confirmed' })
  } else if (message.text == 'new page loaded on website') {
    if (FocusUtils.isURLValid(message.url)) {
      appStateManager.setFocusState(newFocusState)
      if (appStateManager.appState[currentWebsite]) {
        websiteController.focus()
      }
      return Promise.resolve({ status: 'tab change confirmed' })
    }
  } else if (message.text == 'unfocus from vue') {
    toggleFocus()
  }
})

async function handleKeyEvent(e: KeyboardEvent) {
  if (e.type == 'keydown') {
    if (keyPressManager.keyIsShortcutKey(e)) {
      let keyCode = e.code
      keyPressManager.setKeyPressedState(keyCode, true)
    }
    if (keyPressManager.shortcutKeysPressed()) {
      toggleFocus()
    }
  }
  if (e.type == 'keyup') {
    keyPressManager.reset()
  }
}

function renderFocusState(focusState: FocusState) {
  if (!currentWebsite) {
    return
  }
  websiteController.renderFocusState(focusState)
}

async function toggleFocus() {
  appStateManager.toggleFocusState(currentWebsite)
  await appStateManager.updateFocusState(currentWebsite)
  renderFocusState(appStateManager.appState[currentWebsite])
}

;(async function () {
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
  }

  let appState = await FocusUtils.getFromLocalStorage('appState')
  if (currentWebsite != Website.Unsupported) {
    appStateManager = new AppStateManager(appState)
    keyPressManager = new KeyPressManager()
    renderFocusState(appStateManager.appState[currentWebsite])
  }
})()
