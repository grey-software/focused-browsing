import LinkedInController from './ts/LinkedIn/LinkedInController'
import TwitterController from './ts/Twitter/TwitterController'
import YoutubeController from './ts/Youtube/YouTubeController'
import FocusUtils from './focus-utils'
import FocusStateManager from './focusStateManager'
import { browser, Runtime } from 'webextension-polyfill-ts'
import Controller from './ts/controller'
import KeyPressedStateManager from './keyPressStateManager'


let currentURL = document.URL
let currentWebsite: string = ''

let focusStateManager: FocusStateManager
let keyPressedStateManager: KeyPressedStateManager
let controller: Controller


document.addEventListener('keydown', handleKeyEvent, false)
document.addEventListener('keyup', handleKeyEvent, false)

async function toggleFocus() {
  focusStateManager.toggleFocusState(currentWebsite)
  await focusStateManager.updateFocusState(currentWebsite)
  renderFocusState(focusStateManager.focusState[currentWebsite])
}

browser.runtime.onMessage.addListener(async (message: { text: string; url: string }, sender: Runtime.MessageSender) => {
  let newFocusState = await FocusUtils.getFromLocalStorage('focusState')

  if (message.text == 'different tab activated') {
    if (!focusStateManager.hasFocusStateChanged(newFocusState, currentWebsite)) { return }
    focusStateManager.setFocusState(newFocusState)

    if (currentWebsite != null) {
      renderFocusState(focusStateManager.focusState[currentWebsite])
    }

    return Promise.resolve({ status: 'tab change confirmed' })
  } else if (message.text == 'new page loaded on website') {

    console.log("i AM HERE ON load page change")
    console.log("url on new load is " + message.url)

    if (FocusUtils.isURLValid(message.url)) {
      currentURL = message.url
      focusStateManager.setFocusState(newFocusState)
      if (focusStateManager.focusState[currentWebsite]) { controller.focus(currentURL) }
      return Promise.resolve({ status: 'tab change confirmed' })
    }
  } else if (message.text == 'unfocus from vue') {
    toggleFocus()
  }
})

async function handleKeyEvent(e: KeyboardEvent) {
  if (e.type == 'keydown') {
    if (keyPressedStateManager.keyIsShortcutKey(e)) {
      let keyCode = e.code
      if (keyCode.includes('Shift')) {
        keyCode = 'Shift'
      }
      keyPressedStateManager.setKeyPressedState(keyCode, true)
    }
    if (keyPressedStateManager.shortcutKeysPressed()) {
      toggleFocus()
    }
  }
  if (e.type == 'keyup') {
    keyPressedStateManager.restartKeyPressedStates()
  }
}


function renderFocusState(shouldFocus: boolean) {
  if (!currentWebsite) { return }
  shouldFocus ? controller.focus(currentURL) : controller.unfocus(currentURL)
}


; (async function () {
  if (currentURL.includes('twitter.com')) {
    controller = new TwitterController()
    currentWebsite = 'twitter'
  } else if (currentURL.includes('linkedin.com')) {
    controller = new LinkedInController()
    currentWebsite = 'linkedin'
  } else if (currentURL.includes('youtube.com')) {
    controller = new YoutubeController()
    currentWebsite = 'youtube'
  }

  let focusState = await FocusUtils.getFromLocalStorage("focusState")
  if (currentWebsite != '') {
    focusStateManager = new FocusStateManager(focusState)
    keyPressedStateManager = new KeyPressedStateManager()
    renderFocusState(focusStateManager.focusState[currentWebsite])
  }
})()
