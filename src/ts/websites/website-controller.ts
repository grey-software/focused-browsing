import { FocusMode } from './../focus/types'
import utils from './utils'

export default abstract class WebsiteController {
  // Track intervals for automatic cleanup
  protected intervals: Map<string, number> = new Map()
  
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

  // Shared interval management
  protected createInterval(name: string, callback: () => void, delay: number = 250): void {
    this.clearInterval(name)
    const intervalId = window.setInterval(callback, delay)
    this.intervals.set(name, intervalId)
  }

  protected clearInterval(name: string): void {
    const intervalId = this.intervals.get(name)
    if (intervalId) {
      window.clearInterval(intervalId)
      this.intervals.delete(name)
    }
  }

  // Shared element visibility toggle
  protected toggleElementVisibility(
    element: Element | null,
    visible: boolean,
    storageProperty: string,
    onHide?: (element: Element) => void,
    onShow?: (element: Element, storedChild: Node) => void
  ): void {
    if (!element) return
    
    if (!visible) {
      const childToStore = element.children[0]
      if (childToStore) {
        (this as any)[storageProperty] = childToStore
        element.removeChild(childToStore)
        onHide?.(element)
      }
    } else {
      const storedChild = (this as any)[storageProperty]
      if (storedChild) {
        element.appendChild(storedChild)
        onShow?.(element, storedChild)
      }
    }
  }

  // Shared try-catch blocking pattern
  protected tryBlocking(
    checkPage: (url: string) => boolean,
    isHidden: () => boolean,
    hasLoaded: () => boolean,
    onBlock: () => void | Promise<void>
  ): void {
    try {
      const url = document.URL
      if (!checkPage(url)) return
      if (isHidden()) return
      if (hasLoaded()) {
        onBlock()
      }
    } catch (err) {
      // Silent fail - expected behavior
    }
  }

  // Common unfocus cleanup
  protected performCommonUnfocus(): void {
    this.clearAllIntervals()
  }

  // Shared method to clear all intervals
  protected clearAllIntervals(): void {
    this.intervals.forEach((intervalId) => {
      window.clearInterval(intervalId)
    })
    this.intervals.clear()
  }

  abstract focus(): void
  abstract unfocus(): void
  abstract clearIntervals(): void
}
