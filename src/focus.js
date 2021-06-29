import LinkedInController from './js/LinkedIn/LinkedInController'
import TwitterController from './js/Twitter/TwitterController'

const currentURL = document.URL
let controller = null

let pageKey = ''
let focusdb = null

let keyPressedStates = { KeyF: false, Shift: false, KeyB: false }
const keyIsShortcutKey = (e) => {
  return e.key == 'Shift' || e.code == 'KeyB' || e.code == 'KeyF'
}

const allKeysPressed = (keyPressedStates) => {
  let allKeysPressed = true
  Object.values(keyPressedStates).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
  return allKeysPressed
}

function toggleFocus(e) {
  if (e.type == 'keydown') {
    if (keyIsShortcutKey(e)) {
      let keyCode = e.code
      if (keyCode.includes('Shift')) {
        keyCode = 'Shift'
      }
      keyPressedStates[keyCode] = true
    }
    if (allKeysPressed(keyPressedStates)) {
      sendAction()
    }
  }
  if (e.type == 'keyup') {
    keyPressedStates = { KeyF: false, Shift: false, KeyB: false }
  }
}

document.addEventListener('keydown', toggleFocus, false)
document.addEventListener('keyup', toggleFocus, false)

window.addEventListener('resize', handleResize)

function handleResize() {
  try {
    if (focusdb[pageKey]) {
      console.log('here handling action focus ')
      controller.handleActionOnPage(currentURL, 'focus')
      // handle this with using toggle function to not trigger intervals
    }
  } catch (err) {}
}

function sendAction() {
  if (!focusdb[pageKey]) {
    controller.handleActionOnPage(currentURL, 'focus')
  } else {
    controller.handleActionOnPage(currentURL, 'unfocus')
  }
  focusdb[pageKey] = !focusdb[pageKey]
}

;(function () {
  if (currentURL.includes('twitter.com')) {
    controller = new TwitterController()
    pageKey = 'twitter'
  } else if (currentURL.includes('linkedin.com')) {
    controller = new LinkedInController()
    pageKey = 'linkedin'
  }

  focusdb = { twitter: false, linkedin: false }

  if (pageKey != null) {
    sendAction()
  }
})()
