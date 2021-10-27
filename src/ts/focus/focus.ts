import LinkedInController from '../websites/linkedin/linkedin-controller'
import TwitterController from '../websites/twitter/twitter-controller'
import YoutubeController from '../websites/youtube/youtube-controller'
import GithubController from '../websites/github/github-controller'
import FocusUtils from './focus-utils'
import FocusStateManager from './focus-state-manager'
import { browser, Runtime } from 'webextension-polyfill-ts'
import WebsiteController from '../websites/website-controller'
import KeyPressManager from './keypress-manager'

let currentWebsite: string = ''

let focusStateManager: FocusStateManager
let keyPressManager: KeyPressManager
let websiteController: WebsiteController

document.addEventListener('keydown', handleKeyEvent, false)
document.addEventListener('keyup', handleKeyEvent, false)

browser.runtime.onMessage.addListener(async (message: { text: string; url: string }, sender: Runtime.MessageSender) => {
  let newFocusState = await FocusUtils.getFromLocalStorage('focusState')

  if (message.text == 'different tab activated') {
    if (!focusStateManager.hasFocusStateChanged(newFocusState, currentWebsite)) {
      return
    }
    focusStateManager.setFocusState(newFocusState)

    if (currentWebsite != null) {
      renderFocusState(focusStateManager.focusState[currentWebsite])
    }

    return Promise.resolve({ status: 'tab change confirmed' })
  } else if (message.text == 'new page loaded on website') {
    if (FocusUtils.isURLValid(message.url)) {
      focusStateManager.setFocusState(newFocusState)
      if (focusStateManager.focusState[currentWebsite]) {
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

function renderFocusState(shouldFocus: boolean) {
  if (!currentWebsite) {
    return
  }
  shouldFocus ? websiteController.focus() : websiteController.unfocus()
}

async function toggleFocus() {
  focusStateManager.toggleFocusState(currentWebsite)
  await focusStateManager.updateFocusState(currentWebsite)
  renderFocusState(focusStateManager.focusState[currentWebsite])
}

;(async function () {
  let currentURL = document.URL
  if (currentURL.includes('twitter.com')) {
    websiteController = new TwitterController()
    currentWebsite = 'twitter'
  } else if (currentURL.includes('linkedin.com')) {
    websiteController = new LinkedInController()
    currentWebsite = 'linkedin'
  } else if (currentURL.includes('youtube.com')) {
    websiteController = new YoutubeController()
    currentWebsite = 'youtube'
  } else if (currentURL.includes('github.com')) {
    websiteController = new GithubController()
    currentWebsite = 'github'
  }

  let focusState = await FocusUtils.getFromLocalStorage('focusState')
  if (currentWebsite != '') {
    focusStateManager = new FocusStateManager(focusState)
    keyPressManager = new KeyPressManager()
    renderFocusState(focusStateManager.focusState[currentWebsite])
  }
})()
