import LinkedInController from '../linkedin/linkedin-controller'
import TwitterController from '../twitter/twitter-controller'
import YoutubeController from '../youtube/youtube-controller'
import FocusUtils from './focus-utils'
import FocusStateManager from './focus-state-manager'
import { browser, Runtime } from 'webextension-polyfill-ts'
import WebsiteController from '../website-controller'
import KeyPressManager from './keypress-manager'

let currentURL = document.URL
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
    console.log('i AM HERE ON load page change')
    console.log('url on new load is ' + message.url)

    if (FocusUtils.isURLValid(message.url)) {
      currentURL = message.url
      focusStateManager.setFocusState(newFocusState)
      if (focusStateManager.focusState[currentWebsite]) {
        websiteController.focus(currentURL)
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
  shouldFocus ? websiteController.focus(currentURL) : websiteController.unfocus(currentURL)
}

async function toggleFocus() {
  focusStateManager.toggleFocusState(currentWebsite)
  await focusStateManager.updateFocusState(currentWebsite)
  renderFocusState(focusStateManager.focusState[currentWebsite])
}

; (async function () {
  if (currentURL.includes('twitter.com')) {
    websiteController = new TwitterController()
    currentWebsite = 'twitter'
  } else if (currentURL.includes('linkedin.com')) {
    websiteController = new LinkedInController()
    currentWebsite = 'linkedin'
  } else if (currentURL.includes('youtube.com')) {
    websiteController = new YoutubeController()
    currentWebsite = 'youtube'
  }

  let focusState = await FocusUtils.getFromLocalStorage('focusState')
  if (currentWebsite != '') {
    focusStateManager = new FocusStateManager(focusState)
    keyPressManager = new KeyPressManager()
    renderFocusState(focusStateManager.focusState[currentWebsite])
  }
})()
