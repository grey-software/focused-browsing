import LinkedInController from './js/LinkedIn/LinkedInController'
import TwitterController from './js/Twitter/TwitterController'
import FocusUtils from './focus-utils'

let currentURL = document.URL
let currentWebsite = ''
let controller = null
let focusState = null
let keyPressedStates = { KeyF: false, Shift: false, KeyB: false }

document.addEventListener('keydown', handleKeyEvent, false)
document.addEventListener('keyup', handleKeyEvent, false)

async function toggleFocus() {
  toggleFocusState()
  await updateFocusState()
  renderFocusState(focusState[currentWebsite])
}

chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
  let newFocusState = await FocusUtils.getFromLocalStorage('focusState')
  if (msg.text == 'different tab activated') {
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
    sendResponse({ status: 'tab change confirmed' })
  } else if (msg.text == 'new page loaded on website') {
    if (FocusUtils.isURLValid(msg.url)) {
      currentURL = msg.url
      focusState = newFocusState
      initFocus()
      sendResponse({ status: 'tab change within website confirmed' })
    }
  } else if (msg.text == 'unfocus from vue') {
    toggleFocus()
  }
})

async function handleKeyEvent(e) {
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
  }
  focusState = await FocusUtils.getFromLocalStorage('focusState')
}

async function updateFocusState() {
  let newState = await FocusUtils.getFromLocalStorage('focusState')
  newState[currentWebsite] = focusState[currentWebsite]
  await FocusUtils.setFocusStateInLocalStorage('focusState', newState)
  focusState = newState
}

async function renderFocusState(shouldFocus) {
  shouldFocus ? controller.focus(currentURL) : controller.unfocus(currentURL)
}

function toggleFocusState() {
  focusState[currentWebsite] = !focusState[currentWebsite]
}

const isCurrentlyFocused = () => focusState[currentWebsite]
const setKeyPressedState = (keyCode, state) => (keyPressedStates[keyCode] = state)

function initFocus() {
  if (!currentWebsite) {
    return
  }
  if (isCurrentlyFocused()) {
    controller.focus(currentURL)
  }
}

;(async function () {
  // const browser = require("webextension-polyfill");
  // browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
  //   console.log("current active tab is")
  //   var activeTab = tabs[0]
  //   // console.log(activeTab)
  //   // browser.tabs.sendMessage(activeTab.id, { text: 'unfocus from vue' })
  // })


  await setUpFocusScript()
  initFocus()
})()
