import { KeyPressedState } from './types'

export default class KeyPressManager {
  keyPressedState: KeyPressedState

  constructor() {
    this.keyPressedState = { ShiftLeft: false, ShiftRight: false }
  }

  setKeyPressedState(keyCode: string, state: boolean) {
    this.keyPressedState[keyCode] = state
  }

  reset() {
    this.keyPressedState = { ShiftLeft: false, ShiftRight: false }
  }

  keyIsShortcutKey(e: KeyboardEvent) {
    return e.code == 'ShiftLeft' || e.code == 'ShiftRight'
  }

  isShortcutPressed() {
    // Check for both shift keys pressed (original behavior)
    return this.keyPressedState.ShiftLeft && this.keyPressedState.ShiftRight
  }
}
