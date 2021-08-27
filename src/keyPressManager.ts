import { KeyPressedStates } from "./types"

export default class KeyPressManager {
    keyPressedStates: KeyPressedStates

    constructor() {
        this.keyPressedStates = { ShiftRight: false, ShiftLeft: false }
    }

    setKeyPressedState(keyCode: string, state: boolean) {
        this.keyPressedStates[keyCode] = state
    }

    restartKeyPressedStates() {
        this.keyPressedStates = { ShiftRight: false, ShiftLeft: false }
    }

    keyIsShortcutKey(e: KeyboardEvent) {
        return e.code == 'ShiftLeft' || e.code == 'ShiftRight'
    }

    shortcutKeysPressed() {
        let allKeysPressed = true
        Object.values(this.keyPressedStates).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
        return allKeysPressed
    }

}