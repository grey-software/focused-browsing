import XUtils from './x-utils'
import WebsiteController from '../website-controller'

/**
 * Controls X.com focus mode on the home page.
 *
 * Home page: hides the timeline feed and the sidebar (trends, who to follow,
 * news). Injects a quote into the feed area.
 *
 * X.com uses SPA navigation internally; DistractionWatcher re-fires its
 * callbacks via MutationObserver so new DOM regions are hidden as they appear.
 */
export default class XController extends WebsiteController {
  protected readonly quotePosition = 'prepend' as const

  protected getFeedElement(): HTMLElement | null {
    return XUtils.getXFeed() as HTMLElement | null
  }

  protected applyQuoteStyles(quoteElement: HTMLDivElement): void {
    const isDark = XUtils.isDarkTheme()

    quoteElement.style.background = 'transparent'
    quoteElement.style.textAlign = 'left'
    quoteElement.style.padding = '48px 16px'
    quoteElement.style.width = '100%'
    quoteElement.style.boxSizing = 'border-box'

    const quoteText = quoteElement.querySelector('p:first-child') as HTMLElement
    const quoteSource = quoteElement.querySelector('p:last-child') as HTMLElement
    if (quoteText) {
      quoteText.style.color = isDark ? '#e7e9ea' : '#0f1419'
      quoteText.style.marginBottom = '8px'
    }
    if (quoteSource) {
      quoteSource.style.color = isDark ? '#71767b' : '#536471'
    }
  }

  focus() {
    console.log('XController: Entering focus mode.')

    if (XUtils.isHomePage(document.URL)) {
      if (XUtils.hasFeedLoaded() && !XUtils.isFeedHidden()) {
        this.setFeedVisibility(false)
      }
      this.hideSidebar()
    }

    this.setupDistraction({
      name: 'x-feed',
      observeTarget: '[data-testid="primaryColumn"], main[role="main"], body',
      isOnCorrectPage: () => XUtils.isHomePage(document.URL),
      hasLoaded: XUtils.hasFeedLoaded,
      isAlreadyHidden: XUtils.isFeedHidden,
      hide: () => this.setFeedVisibility(false),
    })

    this.setupDistraction({
      name: 'x-sidebar',
      observeTarget: 'body',
      isOnCorrectPage: () => XUtils.isHomePage(document.URL),
      hasLoaded: () => XUtils.getXSidebar() !== null,
      isAlreadyHidden: XUtils.isSidebarHidden,
      hide: () => this.hideSidebar(),
    })
  }

  /** Hides only the sidebar while keeping the feed visible. */
  customFocus() {
    console.log('XController: Entering custom focus mode (sidebar only).')

    this.stopWatchingAll()
    this.clearAllIntervals()

    if (XUtils.isHomePage(document.URL)) {
      this.setFeedVisibility(true)
      this.hideSidebar()
    }

    this.setupDistraction({
      name: 'x-sidebar',
      observeTarget: 'body',
      isOnCorrectPage: () => XUtils.isHomePage(document.URL),
      hasLoaded: () => XUtils.getXSidebar() !== null,
      isAlreadyHidden: XUtils.isSidebarHidden,
      hide: () => this.hideSidebar(),
    })
  }

  unfocus() {
    console.log('XController: Exiting focus mode.')
    this.stopWatchingAll()
    this.clearAllIntervals()

    if (XUtils.isHomePage(document.URL)) {
      this.setFeedVisibility(true)
      this.showSidebar()
    }
  }

  private hideSidebar(): void {
    const sidebar = XUtils.getXSidebar()
    if (sidebar) this.hideElement(sidebar)
  }

  private showSidebar(): void {
    const sidebar = XUtils.getXSidebar()
    if (sidebar) this.showElement(sidebar)
  }
}
