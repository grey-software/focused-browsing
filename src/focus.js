import LinkedInController from './js/LinkedIn/LinkedInController'
import TwitterController from './js/Twitter/TwitterController'
import FocusUtils from './focus-utils'

let currentURL = document.URL
let currentWebsite = ''
let controller = null
let focusState = null
let keyPressedStates = { KeyF: false, Shift: false, KeyB: false }

document.addEventListener('keydown', handleKeyboardShortcuts, false)
document.addEventListener('keyup', handleKeyboardShortcuts, false)

async function onToggle() {
  toggleFocus()
  await updateStorage()
  renderFocusState(focusState[currentWebsite])
}

chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {

  console.log(msg)
  let newFocusState = await getFocusStateFromLocalStorage('focusState')

  if (msg.text == 'different tab activated') {
    console.log('in tab activation code')
    console.log('new focus state: ' + JSON.stringify(newFocusState))
    console.log('old focus state: ' + JSON.stringify(focusState))
    if (newFocusState[currentWebsite] == focusState[currentWebsite]) {
      console.log("state of web page didn't change")
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
    onToggle()
  }
})

async function handleKeyboardShortcuts(e) {
  if (e.type == 'keydown') {
    console.log('key down logs')
    console.log(e)
    if (FocusUtils.keyIsShortcutKey(e)) {
      let keyCode = e.code
      if (keyCode.includes('Shift')) {
        keyCode = 'Shift'
      }
      setKeyPressedState(keyCode, true)
    }
    if (FocusUtils.shortcutKeysPressed(keyPressedStates)) {
      console.log("pressed all keys")

      onToggle()
    }
  }
  if (e.type == 'keyup') {
    console.log('key up logs')
    console.log(e)
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
  focusState = await getFocusStateFromLocalStorage('focusState')
  console.log(focusState)
}

async function updateStorage() {
  let newState = await getFocusStateFromLocalStorage('focusState')
  newState[currentWebsite] = focusState[currentWebsite]
  await setFocusStateInLocalStorage('focusState', newState)
  focusState = newState
}

async function renderFocusState(shouldFocus) {
  shouldFocus ? controller.focus(currentURL) : controller.unfocus(currentURL)
}

function toggleFocus() {
  focusState[currentWebsite] = !focusState[currentWebsite]
}

const isCurrentlyFocused = () => focusState[currentWebsite]
const setKeyPressedState = (keyCode, state) => (keyPressedStates[keyCode] = state)

function initFocus() {
  if (!currentWebsite) {
    return
  }
  console.log('current website is: ' + currentWebsite)
  if (isCurrentlyFocused()) {
    console.log("need to focus on: " + currentURL)
    controller.focus(currentURL)
  }
}

async function getFocusStateFromLocalStorage(name) {
  return new Promise(function (resolve, reject) {
    try {
      chrome.storage.local.get(name, function (items) {
        var target = items[name]
        resolve(target)
      })
    } catch {
      reject()
    }
  })
}

async function setFocusStateInLocalStorage(storageName, focusState) {
  return new Promise(function (resolve, _) {
    var obj = {}
    obj[storageName] = focusState
    chrome.storage.local.set(obj, function () {
      resolve('var set successfully')
    })
  })
}

;(async function () {
  await setUpFocusScript()
  initFocus()
})()
