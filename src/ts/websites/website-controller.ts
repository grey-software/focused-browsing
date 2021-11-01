import { FocusMode } from './../focus/types'

export default abstract class WebsiteController {
  renderFocusMode(focusMode: FocusMode) {
    switch (focusMode) {
      case FocusMode.Focused: {
        this.focus()
        return
      }
      case FocusMode.Unfocused: {
        this.unfocus()
        return
      }
      case FocusMode.Premium: {
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
