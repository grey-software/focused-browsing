const keyIsShortcutKey = (e) => {
  return e.key == 'Shift' || e.code == 'KeyB' || e.code == 'KeyF'
}

const allKeysPressed = (keyPressedStates) => {
    let allKeysPressed = true
    Object.values(keyPressedStates).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
    return allKeysPressed
}
  
module.exports = {keyIsShortcutKey, allKeysPressed}