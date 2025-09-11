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
      
    }
  }

  abstract focus(): void
  abstract unfocus(): void
  abstract clearIntervals(): void
}
