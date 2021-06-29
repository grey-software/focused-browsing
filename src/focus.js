import LinkedInController from './js/LinkedIn/LinkedInController'
import TwitterController from './js/Twitter/TwitterController'
import FocusUtils from './focus-utils'

const currentURL = document.URL
let currentWebsite = ''
let controller = null
const focusState = { twitter: false, linkedin: false }
let keyPressedStates = { KeyF: false, Shift: false, KeyB: false }

document.addEventListener('keydown', toggleFocus, false)
document.addEventListener('keyup', toggleFocus, false)
window.addEventListener('resize', handleResize)

function toggleFocus(e) {
  if (e.type == 'keydown') {
    if (FocusUtils.keyIsShortcutKey(e)) {
      let keyCode = e.code
      if (keyCode.includes('Shift')) {
        keyCode = 'Shift'
      }
      setKeyPressedState(keyCode, true)
    }
    if (FocusedUtils.allKeysPressed(keyPressedStates)) {
      updateFocusState()
    }
  }
  if (e.type == 'keyup') {
    keyPressedStates = { KeyF: false, Shift: false, KeyB: false }
  }
}

function handleResize() {
  try {
    if (isCurrentlyFocused) {
      console.log('here handling action focus ')
      controller.focus(currentURL)
      // handle this with using toggle function to not trigger intervals
    }
  } catch (err) {
    console.log(err)
  }
}

const shouldFocus = () => !focusState[currentWebsite]
const isCurrentlyFocused = () => focusState[currentWebsite]
const setKeyPressedState = (keyCode, state) => (keyPressedStates[keyCode] = state)

function updateFocusState() {
  shouldFocus ? controller.focus(currentURL) : controller.unfocus(currentURL)
  focusState[currentWebsite] = !focusState[currentWebsite]
}

function setUpFocusScript() {
  if (currentURL.includes('twitter.com')) {
    controller = new TwitterController()
    currentWebsite = 'twitter'
  } else if (currentURL.includes('linkedin.com')) {
    controller = new LinkedInController()
    currentWebsite = 'linkedin'
  }
}

function initFocus() {
  if (currentWebsite != null) {
    if (shouldFocus) {
      updateFocusState()
    }
  }
}

;(function () {
  setUpFocusScript()
  initFocus()
})()
