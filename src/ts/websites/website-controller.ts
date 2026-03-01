import { FocusMode } from './../focus/types'
import DistractionWatcher, { DistractionTarget } from './distraction-watcher'
import { browser } from 'webextension-polyfill-ts'
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

export default abstract class WebsiteController {
  // Track intervals for automatic cleanup
  protected intervals: Map<string, number> = new Map()

  // Simple distraction watching
  protected distractionWatcher: DistractionWatcher = new DistractionWatcher()

  protected abstract readonly quotePosition: 'prepend' | 'append'

  // Quote and feed state (shared across all controllers)
  protected quoteElement: HTMLDivElement | null = null
  protected isCreatingQuote: boolean = false
  protected isFeedBlocked: boolean = false

  // Element hiding: stores original display values for restoration
  protected hiddenDisplayValues: Map<HTMLElement, string> = new Map()

  constructor() {
    this.addStorageListener()
  }

  // --- Element hiding via inline style.display ---
  // Works on all sites regardless of CSP. No <style> tag needed.

  protected hideElement(el: HTMLElement): void {
    if (!this.hiddenDisplayValues.has(el)) {
      this.hiddenDisplayValues.set(el, el.style.display)
    }
    if (el.style.display !== 'none') {
      el.style.setProperty('display', 'none', 'important')
    }
  }

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

  protected async injectQuote(feedElement: HTMLElement): Promise<void> {
    const settings = await browser.storage.local.get('showQuote')
    if (settings.showQuote === false) return

    if (this.quoteElement && document.contains(this.quoteElement)) return
    if (this.isCreatingQuote) return

    this.isCreatingQuote = true
    try {
      this.quoteElement = await quoteUtils.createSimpleQuoteElement()
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

  protected removeQuote(): void {
    this.quoteElement?.remove()
    this.quoteElement = null
    this.isCreatingQuote = false
  }

  /** Override to apply site-specific styles (e.g. YouTube dark theme) */
  protected applyQuoteStyles(_quoteElement: HTMLDivElement): void {
    // Default: no extra styles
  }

  // --- Storage listener ---

  private addStorageListener(): void {
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        if (changes.showQuote) {
          this.handleShowQuoteChange(changes.showQuote.newValue)
        }
        if (changes.textSize) {
          this.handleTextSizeChange(changes.textSize.newValue)
        }
      }
    })
  }

  private handleShowQuoteChange(showQuote: boolean): void {
    if (showQuote) {
      if (this.isFeedBlocked && !this.quoteElement) {
        const feed = this.getFeedElement()
        if (feed) this.injectQuote(feed)
      }
    } else {
      this.removeQuote()
    }
  }

  private handleTextSizeChange(textSize: string): void {
    if (this.quoteElement) {
      quoteUtils.updateQuoteTextSize(this.quoteElement, textSize)
    }
  }

  // --- Feed hide/show ---

  protected hideFeed(feedElement: HTMLElement): void {
    this.isFeedBlocked = true
    // Hide all direct children except the quote
    Array.from(feedElement.children).forEach((child) => {
      const el = child as HTMLElement
      if (!el.classList?.contains('focus-mode-quote')) {
        this.hideElement(el)
      }
    })
  }

  protected showFeed(): void {
    this.removeQuote()
    this.showAllElements()
    this.isFeedBlocked = false
  }

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

  protected setupDistraction(config: DistractionConfig): void {
    if (!config.isOnCorrectPage()) return

    const distractionTarget: DistractionTarget = {
      target: config.observeTarget,
      whenFound: () => {
        if (config.hasLoaded() && !config.isAlreadyHidden()) {
          config.hide()
        }
      },
      options: config.observerOptions ?? { childList: true, subtree: true }
    }

    this.watchFor(config.name, distractionTarget)
  }

  // --- Focus mode dispatch ---

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
      case FocusMode.CustomFocus: {
        this.customFocus()
        return
      }
    }
  }

  // --- Interval management ---

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

  protected clearAllIntervals() {
    this.intervals.forEach((intervalId) => {
      window.clearInterval(intervalId)
    })
    this.intervals.clear()
  }

  // --- Distraction watching delegates ---

  protected watchFor(name: string, distractionTarget: DistractionTarget): void {
    this.distractionWatcher.watchFor(name, distractionTarget)
  }

  protected stopWatching(name: string): void {
    this.distractionWatcher.stopWatching(name)
  }

  protected stopWatchingAll(): void {
    this.distractionWatcher.stopWatchingAll()
  }

  protected abstract focus(): void
  protected abstract unfocus(): void
  protected customFocus(): void {
    this.focus()
  }
}
