import LinkedInController from './ts/LinkedIn/LinkedInController'
import TwitterController from './ts/Twitter/TwitterController'
import YoutubeController from './ts/Youtube/YouTubeController'
import FocusUtils from './focus-utils'
import { browser, Runtime } from 'webextension-polyfill-ts'
import { FocusState, KeyPressedStates } from './types'

let currentURL = document.URL
let currentWebsite: string = ''
let controller: TwitterController | LinkedInController | YoutubeController
let focusState: FocusState
let keyPressedStates: KeyPressedStates = { KeyF: false, Shift: false, KeyB: false }

document.addEventListener('keydown', handleKeyEvent, false)
document.addEventListener('keyup', handleKeyEvent, false)

async function toggleFocus() {
  toggleFocusState()
  await updateFocusState()
  renderFocusState(focusState[currentWebsite])
}

browser.runtime.onMessage.addListener(async (message: { text: string; url: string }, sender: Runtime.MessageSender) => {
  let newFocusState = await FocusUtils.getFromLocalStorage('focusState')
  if (message.text == 'different tab activated') {
    console.log("I am here on tab change")
    if (newFocusState[currentWebsite] == focusState[currentWebsite]) {
      // state of web page didn't change
      return
    }

    focusState = newFocusState
    if (currentWebsite != null) {
      if (isCurrentlyFocused()) {
        controller.focus(currentURL)
      } else {
        controller.unfocus(currentURL)
      }
    }
    return Promise.resolve({ status: 'tab change confirmed' })
  } else if (message.text == 'new page loaded on website') {
    console.log("i AM HERE ON load page change")
    console.log("url on new load is " + message.url)
    if (FocusUtils.isURLValid(message.url)) {
      currentURL = message.url
      focusState = newFocusState
      initFocus()
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

async function setUpFocusScript() {
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
  focusState = await FocusUtils.getFromLocalStorage('focusState')
}

async function updateFocusState() {
  let newState = await FocusUtils.getFromLocalStorage('focusState')
  newState[currentWebsite] = focusState[currentWebsite]
  FocusUtils.setFocusStateInLocalStorage('focusState', newState)
  focusState = newState
}

async function renderFocusState(shouldFocus: boolean) {
  shouldFocus ? controller.focus(currentURL) : controller.unfocus(currentURL)
}

function toggleFocusState() {
  focusState[currentWebsite] = !focusState[currentWebsite]
}

const isCurrentlyFocused = () => focusState[currentWebsite]
const setKeyPressedState = (keyCode: string, state: boolean) => (keyPressedStates[keyCode] = state)

function initFocus() {
  if (!currentWebsite) {
    return
  }
  if (isCurrentlyFocused()) {
    console.log("I am going to focus here")
    controller.focus(currentURL)
  } else if (currentURL.includes("youtube.com/watch")) {
    controller.unfocus(currentURL)
  }
}

; (async function () {
  await setUpFocusScript()
  initFocus()
})()
