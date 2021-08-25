import { browser } from "webextension-polyfill-ts"
import { FocusState } from "./types"
import FocusUtils from './focus-utils'

export default class FocusStateManager {
    focusState: FocusState

    constructor(focusState: FocusState) {
        this.focusState = focusState
    }


    isCurrentlyFocused(currentWebsite: string) {
        return this.focusState[currentWebsite]
    }

    async hasFocusStateChanged(newFocusState: FocusState, currentWebsite: string) {
        if (newFocusState[currentWebsite] != this.focusState[currentWebsite]) {
            // state of web page didn't change
            return true
        }
        return false
    }

    setFocusState(newFocusState: FocusState) {
        this.focusState = newFocusState
    }


    setFocusStateInLocalStorage(storageName: string, focusState: FocusState) {
        var obj: any = {}
        obj[storageName] = focusState
        browser.storage.local.set(obj)
    }

    toggleFocusState(currentWebsite: string) {
        this.focusState[currentWebsite] = !this.focusState[currentWebsite]
    }

    async updateFocusState(currentWebsite: string) {
        let newState = await FocusUtils.getFromLocalStorage('focusState')
        newState[currentWebsite] = this.focusState[currentWebsite]
        FocusUtils.setFocusStateInLocalStorage('focusState', newState)
        this.focusState = newState
    }

}