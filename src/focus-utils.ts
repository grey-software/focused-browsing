import { browser } from "webextension-polyfill-ts"

const keyIsShortcutKey = (e: KeyboardEvent) => {
  return e.key == 'Shift' || e.code == 'KeyB' || e.code == 'KeyF'
}

const shortcutKeysPressed = (keyPressedStates: {[key: string]:boolean}) => {
  let allKeysPressed = true
  Object.values(keyPressedStates).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
  return allKeysPressed
}

const isURLValid = (url: string) => {
  return url.includes('twitter.com') || url.includes('linkedin.com')
}

async function getFromLocalStorage(name: string) {

  let storeObject = await browser.storage.local.get(name)
  return storeObject[name]
    
}

function setFocusStateInLocalStorage(storageName: string, focusState:any) {
    var obj:any = {}
    obj[storageName] = focusState
    browser.storage.local.set(obj)
}

export default {
  keyIsShortcutKey,
  shortcutKeysPressed,
  isURLValid,
  getFromLocalStorage,
  setFocusStateInLocalStorage,
}
