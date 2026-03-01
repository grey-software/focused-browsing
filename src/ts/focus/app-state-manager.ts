import { AppState, FocusMode, Website } from './types'
import FocusUtils from './focus-utils'

export default class AppStateManager {
  appState: AppState

  constructor(appState: AppState) {
    this.appState = appState
  }

  async loadLatestState() {
    this.appState = await FocusUtils.getFromLocalStorage('appState')
  }

  getFocusMode(currentWebsite: Website): FocusMode {
    return this.appState[currentWebsite]
  }

  async updateAppState(currentWebsite: Website) {
    let updatedState = await FocusUtils.getFromLocalStorage('appState')
    updatedState[currentWebsite] = this.appState[currentWebsite]
    FocusUtils.setInLocalStorage('appState', updatedState)
    this.appState = updatedState
  }

  async updateFocusMode(currentWebsite: Website, cycle: FocusMode[]) {
    const currentMode = this.appState[currentWebsite]
    const currentIndex = cycle.indexOf(currentMode)
    const nextIndex = (currentIndex + 1) % cycle.length
    this.appState[currentWebsite] = cycle[nextIndex] ?? cycle[0]
    await this.updateAppState(currentWebsite)
  }

  async setFocusMode(currentWebsite: Website, focusMode: FocusMode) {
    this.appState[currentWebsite] = focusMode
    await this.updateAppState(currentWebsite)
  }
}
