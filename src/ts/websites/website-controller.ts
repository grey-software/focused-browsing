import { FocusState } from './../focus/types'

export default abstract class WebsiteController {
  renderFocusState(focusState: FocusState) {
    switch (focusState) {
      case FocusState.Focused: {
        this.focus()
        return
      }
      case FocusState.Unfocused: {
        this.unfocus()
        return
      }
      case FocusState.Premium: {
        this.premiumFocus()
        return
      }
    }
  }

  abstract focus(): void
  abstract unfocus(): void
  abstract premiumFocus(): void
  abstract clearIntervals(): void
}
