import LinkedInUtils from './linkedin-utils'
import WebsiteController from '../website-controller'

/** LinkedIn-specific controller that hides feed content and side panels on the homepage. */
export default class LinkedInController extends WebsiteController {
  protected readonly quotePosition = 'prepend' as const

  private readonly quoteElementId = 'focus-mode-linkedin-quote'

  /** Returns the LinkedIn main feed element, or null if not found. */
  protected getFeedElement(): HTMLElement | null {
    return LinkedInUtils.getLinkedInFeed() as HTMLElement | null
  }

  /** Applies LinkedIn-specific ID and class to the quote element. */
  protected applyQuoteStyles(quoteElement: HTMLDivElement): void {
    quoteElement.id = this.quoteElementId
    quoteElement.classList.add('focus-mode-linkedin-quote')
  }

  /** Reuses an existing quote element if found by ID, otherwise creates a new one. */
  protected async injectQuote(feedElement: HTMLElement): Promise<void> {
    // Check for existing quote by ID (LinkedIn's DOM may recreate elements)
    const existing = document.getElementById(this.quoteElementId) as HTMLDivElement | null
    if (existing) {
      this.quoteElement = existing
      return
    }
    await super.injectQuote(feedElement)
  }

  /** Hides the feed and side panels, sets up observers for both. */
  focus() {
    console.log('LinkedInController: Entering focus mode.')

    // Immediate blocking
    if (LinkedInUtils.isHomePage(document.URL)) {
      if (LinkedInUtils.hasFeedLoaded() && !LinkedInUtils.isFeedHidden()) {
        this.setFeedVisibility(false)
      }
      this.hidePanelCandidates()
    }

    // Targeted observers — one per distraction region
    this.setupDistraction({
      name: 'linkedin-feed',
      observeTarget: FEED_OBSERVE_TARGETS,
      isOnCorrectPage: () => LinkedInUtils.isHomePage(document.URL),
      hasLoaded: LinkedInUtils.hasFeedLoaded,
      isAlreadyHidden: LinkedInUtils.isFeedHidden,
      hide: () => this.setFeedVisibility(false),
    })

    this.setupDistraction({
      name: 'linkedin-panel',
      observeTarget: PANEL_OBSERVE_TARGETS,
      isOnCorrectPage: () => LinkedInUtils.isHomePage(document.URL),
      // Panel discovery uses DOM walking, not CSS selectors — always attempt
      hasLoaded: () => !!this.getFeedElement(),
      isAlreadyHidden: () => false,
      hide: () => this.hidePanelCandidates(),
    })
  }

  /** Hides only the side panels while keeping the feed visible. */
  customFocus() {
    console.log('LinkedInController: Entering custom focus mode (panels only).')

    // Stop any existing watchers before setting up new ones
    this.stopWatchingAll()
    this.clearAllIntervals()

    if (LinkedInUtils.isHomePage(document.URL)) {
      // Show feed (in case coming from full focus)
      this.setFeedVisibility(true)
      // Hide side panels
      this.hidePanelCandidates()
    }

    // Only watch for panel distractions, not feed
    this.setupDistraction({
      name: 'linkedin-panel',
      observeTarget: PANEL_OBSERVE_TARGETS,
      isOnCorrectPage: () => LinkedInUtils.isHomePage(document.URL),
      hasLoaded: () => !!this.getFeedElement(),
      isAlreadyHidden: () => false,
      hide: () => this.hidePanelCandidates(),
    })
  }

  /** Stops all observers and restores all hidden elements. */
  unfocus() {
    console.log('LinkedInController: Exiting focus mode.')
    this.stopWatchingAll()
    this.clearAllIntervals()

    if (LinkedInUtils.isHomePage(document.URL)) {
      this.setFeedVisibility(true)
    }
  }

  /** Walks the DOM to find and hide right-side panel elements. */
  private hidePanelCandidates(): void {
    const feed = this.getFeedElement()
    if (!feed) return

    const panels = this.getRightPanelCandidates(feed)
    panels.forEach((panel) => this.hideElement(panel))
  }

  /** Walks up the DOM from the feed to find the row container that holds both feed and panel columns. */
  private findFeedRowContainer(feedElement: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = feedElement.parentElement
    for (let depth = 0; depth < 8 && current; depth += 1) {
      const children = Array.from(current.children)
        .filter((child): child is HTMLElement => child instanceof HTMLElement)

      const hasFeedChild = children.some((child) => child.contains(feedElement))
      const nonFeedChildren = children.filter((child) => !child.contains(feedElement))

      if (hasFeedChild && nonFeedChildren.length > 0) {
        return current
      }

      current = current.parentElement
    }
    return null
  }

  /** Returns sibling elements to the right of the feed column, excluding quote elements. */
  private getRightPanelCandidates(feedElement: HTMLElement): HTMLElement[] {
    const feedRow = this.findFeedRowContainer(feedElement)
    if (!feedRow) return []

    const rowChildren = Array.from(feedRow.children)
      .filter((child): child is HTMLElement => child instanceof HTMLElement)

    const feedColumnIndex = rowChildren.findIndex((child) => child.contains(feedElement))
    if (feedColumnIndex === -1) return []

    return rowChildren
      .filter((_, index) => index > feedColumnIndex)
      .filter((child) => child.children.length > 0)
      .filter((child) => child.id !== this.quoteElementId)
      .filter((child) => !child.classList.contains('focus-quote'))
      .filter((child) => !child.classList.contains('focus-quote-simple'))
  }
}

// Observer targets — use body for panel since LinkedIn replaces aside containers entirely,
// which kills any observer attached to them
const FEED_OBSERVE_TARGETS = '.scaffold-layout__main, main#workspace, [role="main"], body'
const PANEL_OBSERVE_TARGETS = 'body'
