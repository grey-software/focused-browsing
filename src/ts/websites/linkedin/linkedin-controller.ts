import LinkedInUtils from './linkedin-utils'
import WebsiteController from '../website-controller'

/** LinkedIn-specific controller that hides feed content and side panels on the homepage. */
export default class LinkedInController extends WebsiteController {
  protected readonly quotePosition = 'prepend' as const

  private readonly quoteElementId = 'focus-mode-linkedin-quote'
  private readonly concealedPanels = new Map<HTMLElement, ConcealedPanelStyles>()

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
    this.restoreConcealedPanels()

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

  /** Shows the feed but keeps nuisance side panels hidden. */
  unfocus() {
    console.log('LinkedInController: Entering unfocused mode (feed visible, panels hidden).')
    this.stopWatchingAll()
    this.clearAllIntervals()
    this.restoreConcealedPanels()

    if (LinkedInUtils.isHomePage(document.URL)) {
      this.setFeedVisibility(true)
      this.hidePanels()
    }

    this.setupDistraction({
      name: 'linkedin-panel',
      observeTarget: PANEL_OBSERVE_TARGETS,
      isOnCorrectPage: () => LinkedInUtils.isHomePage(document.URL),
      hasLoaded: () => LinkedInUtils.getLinkedInPanels().length > 0,
      isAlreadyHidden: LinkedInUtils.arePanelsHidden,
      hide: () => this.hidePanels(),
    })
  }

  /** Hides panels found via CSS selectors (PANEL_SELECTORS). */
  private hidePanels(): void {
    LinkedInUtils.getLinkedInPanels().forEach((panel) => {
      this.concealPanel(panel)
    })
  }

  private concealPanel(panel: HTMLElement): void {
    if (!this.concealedPanels.has(panel)) {
      this.concealedPanels.set(panel, {
        visibility: panel.style.visibility,
        opacity: panel.style.opacity,
        pointerEvents: panel.style.pointerEvents,
      })
    }

    panel.style.setProperty('visibility', 'hidden', 'important')
    panel.style.setProperty('opacity', '0', 'important')
    panel.style.setProperty('pointer-events', 'none', 'important')
  }

  private restoreConcealedPanels(): void {
    this.concealedPanels.forEach((styles, panel) => {
      restoreInlineStyle(panel, 'visibility', styles.visibility)
      restoreInlineStyle(panel, 'opacity', styles.opacity)
      restoreInlineStyle(panel, 'pointer-events', styles.pointerEvents)
    })
    this.concealedPanels.clear()
  }
}

// Observer targets — use body for panel since LinkedIn replaces aside containers entirely,
// which kills any observer attached to them
const FEED_OBSERVE_TARGETS = '.scaffold-layout__main, main#workspace, [role="main"], body'
const PANEL_OBSERVE_TARGETS = 'body'

interface ConcealedPanelStyles {
  visibility: string
  opacity: string
  pointerEvents: string
}

function restoreInlineStyle(element: HTMLElement, property: string, value: string): void {
  if (value === '') {
    element.style.removeProperty(property)
    return
  }

  element.style.setProperty(property, value)
}
