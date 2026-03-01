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
      this.hidePanels()
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
      hasLoaded: () => LinkedInUtils.getLinkedInPanels().length > 0,
      isAlreadyHidden: LinkedInUtils.arePanelsHidden,
      hide: () => this.hidePanels(),
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
      this.hidePanels()
    }

    // Only watch for panel distractions, not feed
    this.setupDistraction({
      name: 'linkedin-panel',
      observeTarget: PANEL_OBSERVE_TARGETS,
      isOnCorrectPage: () => LinkedInUtils.isHomePage(document.URL),
      hasLoaded: () => LinkedInUtils.getLinkedInPanels().length > 0,
      isAlreadyHidden: LinkedInUtils.arePanelsHidden,
      hide: () => this.hidePanels(),
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

  /** Hides panels found via CSS selectors (PANEL_SELECTORS). */
  private hidePanels(): void {
    LinkedInUtils.getLinkedInPanels().forEach((panel) => {
      this.hideElement(panel)
    })
  }
}

// Observer targets — use body for panel since LinkedIn replaces aside containers entirely,
// which kills any observer attached to them
const FEED_OBSERVE_TARGETS = '.scaffold-layout__main, main#workspace, [role="main"], body'
const PANEL_OBSERVE_TARGETS = 'body'
