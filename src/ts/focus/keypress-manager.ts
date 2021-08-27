import { KeyPressedState } from './types'

export default class KeyPressManager {
  keyPressedState: KeyPressedState

  constructor() {
    this.keyPressedState = { ShiftRight: false, ShiftLeft: false }
  }

  setKeyPressedState(keyCode: string, state: boolean) {
    this.keyPressedState[keyCode] = state
  }

  reset() {
    this.keyPressedState = { ShiftRight: false, ShiftLeft: false }
  }

  keyIsShortcutKey(e: KeyboardEvent) {
    return e.code == 'ShiftLeft' || e.code == 'ShiftRight'
  }

  shortcutKeysPressed() {
    let allKeysPressed = true
    Object.values(this.keyPressedState).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
    return allKeysPressed
  }
}
