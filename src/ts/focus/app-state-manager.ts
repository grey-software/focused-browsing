import { AppState, FocusMode, Website } from './types'
import { getFromLocalStorage, setInLocalStorage } from '../storage'

/** Manages per-website focus mode state and persists it to local storage. */
export default class AppStateManager {
  appState: AppState

  constructor(appState: AppState) {
    this.appState = appState
  }

  /** Reloads the app state from local storage to pick up changes from other contexts. */
  async loadLatestState() {
    this.appState = await getFromLocalStorage('appState')
  }

  /** Returns the current focus mode for the given website. */
  getFocusMode(currentWebsite: Website): FocusMode {
    return this.appState[currentWebsite]
  }

  /** Persists the in-memory state for a website to local storage. */
  async updateAppState(currentWebsite: Website) {
    let updatedState = await getFromLocalStorage('appState')
    updatedState[currentWebsite] = this.appState[currentWebsite]
    await setInLocalStorage('appState', updatedState)
    this.appState = updatedState
  }

  /** Advances the focus mode to the next state in the given cycle and persists it. */
  async updateFocusMode(currentWebsite: Website, cycle: FocusMode[]) {
    const currentMode = this.appState[currentWebsite]
    const currentIndex = cycle.indexOf(currentMode)
    const nextIndex = (currentIndex + 1) % cycle.length
    this.appState[currentWebsite] = cycle[nextIndex] ?? cycle[0]
    await this.updateAppState(currentWebsite)
  }

  /** Sets the focus mode for a website to a specific value and persists it. */
  async setFocusMode(currentWebsite: Website, focusMode: FocusMode) {
    this.appState[currentWebsite] = focusMode
    await this.updateAppState(currentWebsite)
  }
}
