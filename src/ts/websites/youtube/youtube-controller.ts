import YouTubeUtils from './youtube-utils'
import WebsiteController from '../website-controller'

export default class YouTubeController extends WebsiteController {
  protected readonly quotePosition = 'append' as const

  protected getFeedElement(): HTMLElement | null {
    return YouTubeUtils.getFeed() as HTMLElement | null
  }

  protected applyQuoteStyles(quoteElement: HTMLDivElement): void {
    const isDark = YouTubeUtils.isDarkTheme()

    // No background — inherit YouTube's own page background
    quoteElement.style.background = 'transparent'
    quoteElement.style.textAlign = 'left'
    quoteElement.style.padding = '48px 24px'
    quoteElement.style.width = '100%'
    quoteElement.style.boxSizing = 'border-box'

    const quoteText = quoteElement.querySelector('p:first-child') as HTMLElement
    const quoteSource = quoteElement.querySelector('p:last-child') as HTMLElement
    if (quoteText) {
      quoteText.style.color = isDark ? '#f1f1f1' : '#0f0f0f'
      quoteText.style.marginBottom = '8px'
    }
    if (quoteSource) {
      quoteSource.style.color = isDark ? '#aaa' : '#606060'
    }
  }

  focus() {
    console.log('YouTubeController: Entering focus mode.')

    // Immediate blocking for visible content
    const url = document.URL
    if (YouTubeUtils.isHomePage(url)) {
      if (YouTubeUtils.hasFeedLoaded() && !YouTubeUtils.isFeedHidden()) {
        this.setFeedVisibility(false)
      }
    } else if (YouTubeUtils.isVideoPage(url)) {
      if (YouTubeUtils.haveSuggestionsLoaded() && !YouTubeUtils.areSuggestionsHidden()) {
        this.hideRegion(YouTubeUtils.getSuggestions() as HTMLElement)
      }
      if (YouTubeUtils.haveCommentsLoaded() && !YouTubeUtils.areCommentsHidden()) {
        this.hideRegion(YouTubeUtils.getVideoComments() as HTMLElement)
      }
      if (YouTubeUtils.havePanelsLoaded() && !YouTubeUtils.arePanelsHidden()) {
        this.hideRegion(YouTubeUtils.getPanels() as HTMLElement)
      }
    }

    // Set up observers for dynamic content
    this.setupDistraction({
      name: 'youtube-feed',
      observeTarget: 'ytd-two-column-browse-results-renderer, ytd-browse',
      isOnCorrectPage: () => YouTubeUtils.isHomePage(document.URL),
      hasLoaded: YouTubeUtils.hasFeedLoaded,
      isAlreadyHidden: YouTubeUtils.isFeedHidden,
      hide: () => this.setFeedVisibility(false),
    })

    this.setupDistraction({
      name: 'youtube-suggestions',
      observeTarget: 'ytd-watch-flexy, ytd-app',
      isOnCorrectPage: () => YouTubeUtils.isVideoPage(document.URL),
      hasLoaded: YouTubeUtils.haveSuggestionsLoaded,
      isAlreadyHidden: YouTubeUtils.areSuggestionsHidden,
      hide: () => this.hideRegion(YouTubeUtils.getSuggestions() as HTMLElement),
    })

    this.setupDistraction({
      name: 'youtube-comments',
      observeTarget: 'ytd-watch-flexy #primary, #primary',
      isOnCorrectPage: () => YouTubeUtils.isVideoPage(document.URL),
      hasLoaded: YouTubeUtils.haveCommentsLoaded,
      isAlreadyHidden: YouTubeUtils.areCommentsHidden,
      hide: () => this.hideRegion(YouTubeUtils.getVideoComments() as HTMLElement),
    })

    this.setupDistraction({
      name: 'youtube-panels',
      observeTarget: 'ytd-app, body',
      isOnCorrectPage: () => YouTubeUtils.isVideoPage(document.URL),
      hasLoaded: YouTubeUtils.havePanelsLoaded,
      isAlreadyHidden: YouTubeUtils.arePanelsHidden,
      hide: () => this.hideRegion(YouTubeUtils.getPanels() as HTMLElement),
    })
  }

  unfocus() {
    console.log('YouTubeController: Exiting focus mode.')
    this.stopWatchingAll()

    const url = document.URL
    if (YouTubeUtils.isHomePage(url)) {
      this.setFeedVisibility(true)
    } else if (YouTubeUtils.isVideoPage(url)) {
      this.showRegion(YouTubeUtils.getSuggestions() as HTMLElement)
      this.showRegion(YouTubeUtils.getVideoComments() as HTMLElement)
      this.showRegion(YouTubeUtils.getPanels() as HTMLElement)
    }
  }

  private hideRegion(el: HTMLElement | null): void {
    if (el) this.hideElement(el)
  }

  private showRegion(el: HTMLElement | null): void {
    if (el) this.showElement(el)
  }
}
