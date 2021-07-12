const keyIsShortcutKey = (e) => {
  return e.key == 'Shift' || e.code == 'KeyB' || e.code == 'KeyF'
}

const shortcutKeysPressed = (keyPressedStates) => {
  let allKeysPressed = true
  Object.values(keyPressedStates).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
  return allKeysPressed
}

const isURLValid = (url) => {
  return url.includes('twitter.com') || url.includes('linkedin.com')
}

function getFromLocalStorage(name) {
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

function setFocusStateInLocalStorage(storageName, focusState) {
  return new Promise(function (resolve, _) {
    var obj = {}
    obj[storageName] = focusState
    chrome.storage.local.set(obj, function () {
      resolve('var set successfully')
    })
  })
}

module.exports = {
  keyIsShortcutKey,
  shortcutKeysPressed,
  isURLValid,
  getFromLocalStorage,
  setFocusStateInLocalStorage,
}
