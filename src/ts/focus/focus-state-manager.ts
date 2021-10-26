import { browser } from 'webextension-polyfill-ts'
import { AppState, FocusState, Website } from './types'
import FocusUtils from './focus-utils'

export default class AppStateManager {
  appState: AppState

  constructor(appState: AppState) {
    this.appState = appState
  }

  isCurrentlyFocused(currentWebsite: Website): FocusState {
    return this.appState[currentWebsite]
  }

  hasFocusStateChanged(newFocusState: AppState, currentWebsite: Website) {
    return newFocusState[currentWebsite] != this.appState[currentWebsite]
  }

  setFocusState(newFocusState: AppState) {
    this.appState = newFocusState
  }

  toggleFocusState(currentWebsite: Website) {
    this.appState[currentWebsite] = (this.appState[currentWebsite] + 1) % 3
  }

  async updateFocusState(currentWebsite: Website) {
    let newState = await FocusUtils.getFromLocalStorage('appState')
    console.log(newState)
    newState[currentWebsite] = this.appState[currentWebsite]
    console.log(newState)
    FocusUtils.setInLocalStorage('appState', newState)
    this.appState = newState
  }
}
