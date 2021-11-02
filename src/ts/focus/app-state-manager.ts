import { AppState, FocusMode, Website } from './types'
import FocusUtils from './focus-utils'

export default class AppStateManager {
  appState: AppState

  constructor(appState: AppState) {
    this.appState = appState
  }

  getFocusMode(currentWebsite: Website): FocusMode {
    return this.appState[currentWebsite]
  }

  async loadLatestState() {
    this.appState = await FocusUtils.getFromLocalStorage('appState')
  }

  async updateFocusMode(currentWebsite: Website) {
    let focusModeCount = 2
    switch (currentWebsite) {
      case Website.Twitter:
      case Website.LinkedIn:
        focusModeCount = 3
        break
    }
    this.appState[currentWebsite] = (this.appState[currentWebsite] + 1) % focusModeCount
    await this.updateAppState(currentWebsite)
  }

  async updateAppState(currentWebsite: Website) {
    let updatedState = await FocusUtils.getFromLocalStorage('appState')
    updatedState[currentWebsite] = this.appState[currentWebsite]
    FocusUtils.setInLocalStorage('appState', updatedState)
    this.appState = updatedState
  }
}
