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
// window.addEventListener('resize', handleResize)

chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
  console.log(msg)
  if (msg.text == 'different tab activated') {
    let newFocusState = await getFocusStateFromLocalStorage('focusState')
    console.log("new focus state")
    console.log(newFocusState)

    console.log("old focus state")
    console.log(focusState)
    if (JSON.stringify(newFocusState) == JSON.stringify(focusState)) {
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
      await setUpFocusScript()
      initFocus()
      sendResponse({ status: 'tab change within website confirmed' })
    }
  }
})

async function handleKeyboardShortcuts(e) {
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
      await updateStorage()
      renderFocusState(focusState[currentWebsite])
    }
  }
  if (e.type == 'keyup') {
    keyPressedStates = { KeyF: false, Shift: false, KeyB: false }
  }
}

function handleResize() {
  try {
    if (isCurrentlyFocused()) {
      console.log('here handling action focus ')
      controller.focus(currentURL)
      // handle this with using toggle function to not trigger intervals
    }
  } catch (err) {
    console.log(err)
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
  await setFocusStateInLocalStorage('focusState', focusState)
}

async function renderFocusState(shouldFocus) {
  console.log('should focus is: ' + shouldFocus)
  console.log(shouldFocus)
  shouldFocus ? controller.focus(currentURL) : controller.unfocus(currentURL)
}

function toggleFocus() {
  console.log('old focus state on toggle')
  console.log(focusState)
  focusState[currentWebsite] = !focusState[currentWebsite]
  console.log('new focus state on toggle')
  console.log(focusState)
}

const isCurrentlyFocused = () => focusState[currentWebsite]
const setKeyPressedState = (keyCode, state) => (keyPressedStates[keyCode] = state)

function initFocus() {
  if (!currentWebsite) {
    return
  }
  console.log('current website is: ' + currentWebsite)
  if (isCurrentlyFocused()) {
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

async function setFocusStateInLocalStorage(name, value) {
  return new Promise(function (resolve, _) {
    var obj = {}
    obj[name] = value
    chrome.storage.local.set(obj, function () {
      resolve('var set successfully')
    })
  })
}

;(async function () {
  await setUpFocusScript()
  initFocus()
})()
