const keyIsShortcutKey = (e) => {
  return e.key == 'Shift' || e.code == 'KeyB' || e.code == 'KeyF'
}

const shortcutKeysPressed = (keyPressedStates) => {
    let allKeysPressed = true
    Object.values(keyPressedStates).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
    return allKeysPressed
}
  
module.exports = {keyIsShortcutKey, shortcutKeysPressed}