import LinkedInController from './ts/LinkedIn/LinkedInController'
import TwitterController from './ts/Twitter/TwitterController'
import YoutubeController from './ts/Youtube/YouTubeController'
import FocusUtils from './focus-utils'
import FocusStateManager from './focusStateManager'
import { browser, Runtime } from 'webextension-polyfill-ts'
import { FocusState, KeyPressedStates } from './types'
import Controller from './ts/controller'


let currentURL = document.URL
let currentWebsite: string = ''

let focusStateManager: FocusStateManager
let controller: Controller

let keyPressedStates: KeyPressedStates = { KeyF: false, Shift: false, KeyB: false }

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
    console.log("I am here on tab change")
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
      renderFocusState(focusStateManager.focusState[currentWebsite])
      return Promise.resolve({ status: 'tab change confirmed' })
    }
  } else if (message.text == 'unfocus from vue') {
    toggleFocus()
  }
})

async function handleKeyEvent(e: KeyboardEvent) {
  if (e.type == 'keydown') {
    if (FocusUtils.keyIsShortcutKey(e)) {
      let keyCode = e.code
      if (keyCode.includes('Shift')) {
        keyCode = 'Shift'
      }
      setKeyPressedState(keyCode, true)
    }
    if (FocusUtils.shortcutKeysPressed(keyPressedStates)) {
      toggleFocus()
    }
  }
  if (e.type == 'keyup') {
    keyPressedStates = { KeyF: false, Shift: false, KeyB: false }
  }
}


async function renderFocusState(shouldFocus: boolean) {
  if (!currentWebsite) { return }
  shouldFocus ? controller.focus(currentURL) : controller.unfocus(currentURL)
}

const setKeyPressedState = (keyCode: string, state: boolean) => (keyPressedStates[keyCode] = state)


function setUpController() {
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
}

; (async function () {
  setUpController()
  let focusState = await FocusUtils.getFromLocalStorage("focusState")
  if (currentWebsite != '') {
    focusStateManager = new FocusStateManager(focusState)
    renderFocusState(focusStateManager.focusState[currentWebsite])
  }
})()
