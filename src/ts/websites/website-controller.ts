import { FocusMode } from './../focus/types'
import DistractionWatcher, { DistractionTarget } from './distraction-watcher'
import quoteUtils from '../quotes'

export interface DistractionConfig {
  name: string
  observeTarget: string
  isOnCorrectPage: () => boolean
  hasLoaded: () => boolean
  isAlreadyHidden: () => boolean
  hide: () => void
  observerOptions?: MutationObserverInit
}

/** Base class for website-specific controllers that hide distracting content and inject quotes. */
export default abstract class WebsiteController {
  // Track intervals for automatic cleanup
  protected intervals: Map<string, number> = new Map()

  protected distractionWatcher: DistractionWatcher = new DistractionWatcher()

  protected abstract readonly quotePosition: 'prepend' | 'append'

  // Quote and feed state (shared across all controllers)
  protected quoteElement: HTMLDivElement | null = null
  protected isCreatingQuote: boolean = false
  protected isFeedBlocked: boolean = false

  // Element hiding: stores original display values for restoration
  protected hiddenDisplayValues: Map<HTMLElement, string> = new Map()

  // --- Element hiding via inline style.display ---
  // Works on all sites regardless of CSP. No <style> tag needed.

  /** Hides an element via inline display:none, saving its original display value for restoration. */
  protected hideElement(el: HTMLElement): void {
    if (!this.hiddenDisplayValues.has(el)) {
      this.hiddenDisplayValues.set(el, el.style.display)
    }
    if (el.style.display !== 'none') {
      el.style.setProperty('display', 'none', 'important')
    }
  }

  /** Restores a previously hidden element to its original display value. */
  protected showElement(el: HTMLElement): void {
    const prev = this.hiddenDisplayValues.get(el)
    if (prev !== undefined) {
      if (prev === '') {
        el.style.removeProperty('display')
      } else {
        el.style.setProperty('display', prev)
      }
      this.hiddenDisplayValues.delete(el)
    } else {
      el.style.removeProperty('display')
    }
  }

  /** Restores all hidden elements to their original display values and clears the tracking map. */
  protected showAllElements(): void {
    this.hiddenDisplayValues.forEach((prev, el) => {
      if (prev === '') {
        el.style.removeProperty('display')
      } else {
        el.style.setProperty('display', prev)
      }
    })
    this.hiddenDisplayValues.clear()
  }

  // --- Quote injection ---

  protected abstract getFeedElement(): HTMLElement | null

  /** Creates and inserts a quote element into the feed if quotes are enabled. */
  protected async injectQuote(feedElement: HTMLElement): Promise<void> {
    // Double guard: isCreatingQuote blocks re-entrant async calls within the
    // same tick; document.contains catches quotes removed from the DOM by the
    // site's SPA (e.g. LinkedIn swapping the feed container).
    if (this.quoteElement && document.contains(this.quoteElement)) return
    if (this.isCreatingQuote) return

    this.isCreatingQuote = true
    try {
      this.quoteElement = quoteUtils.createQuoteElement()
      this.quoteElement.classList.add('focus-mode-quote')
      this.applyQuoteStyles(this.quoteElement)

      if (this.quotePosition === 'prepend') {
        feedElement.prepend(this.quoteElement)
      } else {
        feedElement.appendChild(this.quoteElement)
      }
    } finally {
      this.isCreatingQuote = false
    }
  }

  /** Removes the quote element from the DOM and resets quote state. */
  protected removeQuote(): void {
    this.quoteElement?.remove()
    this.quoteElement = null
    this.isCreatingQuote = false
  }

  /** Override to apply site-specific styles (e.g. YouTube dark theme) */
  protected applyQuoteStyles(_quoteElement: HTMLDivElement): void {
    // Default: no extra styles
  }

  // --- Feed hide/show ---

  /** Hides all feed children except the quote element. */
  protected hideFeed(feedElement: HTMLElement): void {
    this.isFeedBlocked = true
    Array.from(feedElement.children).forEach((child) => {
      const el = child as HTMLElement
      if (!el.classList?.contains('focus-mode-quote')) {
        this.hideElement(el)
      }
    })
  }

  /** Removes the quote and restores all hidden feed elements. */
  protected showFeed(): void {
    this.removeQuote()
    this.showAllElements()
    this.isFeedBlocked = false
  }

  /** Shows or hides the feed. When hiding, also injects a quote if enabled. */
  protected async setFeedVisibility(visible: boolean): Promise<void> {
    const feed = this.getFeedElement()
    if (!feed) return

    if (!visible) {
      this.hideFeed(feed)
      // Re-inject quote if it was lost (e.g. feed element replaced by site)
      if (this.quoteElement && !document.contains(this.quoteElement)) {
        this.quoteElement = null
      }
      await this.injectQuote(feed)
    } else {
      this.showFeed()
    }
  }

  // --- Distraction setup ---

  /** Sets up a MutationObserver to detect and hide a distraction region when it appears. */
  protected setupDistraction(config: DistractionConfig): void {
    if (!config.isOnCorrectPage()) return

    const distractionTarget: DistractionTarget = {
      target: config.observeTarget,
      whenFound: () => {
        if (config.isOnCorrectPage() && config.hasLoaded() && !config.isAlreadyHidden()) {
          config.hide()
        }
      },
      options: config.observerOptions ?? { childList: true, subtree: true }
    }

    this.watchFor(config.name, distractionTarget)
  }

  // --- Focus mode dispatch ---

  /** Dispatches to focus() or unfocus() based on the current mode. */
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

  // --- Interval management ---

  /** Creates a named interval, clearing any existing one with the same name. */
  protected createInterval(name: string, callback: () => void, delay: number = 250): void {
    this.clearInterval(name)
    const intervalId = window.setInterval(callback, delay)
    this.intervals.set(name, intervalId)
  }

  /** Clears a named interval if it exists. */
  protected clearInterval(name: string): void {
    const intervalId = this.intervals.get(name)
    if (intervalId) {
      window.clearInterval(intervalId)
      this.intervals.delete(name)
    }
  }

  /** Clears all active intervals. */
  protected clearAllIntervals() {
    this.intervals.forEach((intervalId) => {
      window.clearInterval(intervalId)
    })
    this.intervals.clear()
  }

  // --- Distraction watching delegates ---

  /** Registers a named MutationObserver for a distraction target. */
  protected watchFor(name: string, distractionTarget: DistractionTarget): void {
    this.distractionWatcher.watchFor(name, distractionTarget)
  }

  /** Disconnects a named MutationObserver. */
  protected stopWatching(name: string): void {
    this.distractionWatcher.stopWatching(name)
  }

  /** Disconnects all active MutationObservers. */
  protected stopWatchingAll(): void {
    this.distractionWatcher.stopWatchingAll()
  }

  protected abstract focus(): void
  protected abstract unfocus(): void
}
