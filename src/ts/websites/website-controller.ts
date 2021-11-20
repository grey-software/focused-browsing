import { FocusMode } from '../types'

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
      case FocusMode.Custom: {
        this.customFocus()
        return
      }
    }
  }

  abstract focus(): void
  abstract unfocus(): void
  abstract customFocus(): void
  abstract clearIntervals(): void
}
