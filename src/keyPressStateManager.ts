import { KeyPressedStates } from "./types"

export default class KeyPressedStateManager {
    keyPressedStates: KeyPressedStates

    constructor() {
        this.keyPressedStates = { KeyF: false, Shift: false, KeyB: false }
    }


    setKeyPressedState(keyCode: string, state: boolean) {
        this.keyPressedStates[keyCode] = state
    }

    restartKeyPressedStates() {
        this.keyPressedStates = { KeyF: false, Shift: false, KeyB: false }
    }

    keyIsShortcutKey(e: KeyboardEvent) {
        return e.key == 'Shift' || e.code == 'KeyB' || e.code == 'KeyF'
    }

    shortcutKeysPressed() {
        let allKeysPressed = true
        Object.values(this.keyPressedStates).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
        return allKeysPressed
    }


}