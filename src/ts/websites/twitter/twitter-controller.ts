import TwitterUtils from './twitter-utils'
import TwitterIFrameUtils from './twitter-iframe-utils'
import utils from '../../utils'
import WebsiteController from '../website-controller'
import twitterUtils from './twitter-utils'

export default class TwitterController extends WebsiteController {
  panelElements: Node[] = []
  feed: null | Element = null
  feedIframe: HTMLIFrameElement

  feedIntervalId: number = 0
  panelIntervalId: number = 0
  adIntervalId: number = 0
  hiddenAdCount: number = 0

  constructor() {
    super()
    this.feedIframe = TwitterIFrameUtils.createTwitterFeedIframe()
  }

  focus() {
    // Since the panel shows up on every page, we clear our panel elements every time we focus because it gets overpopulated with extra elements
    this.panelElements = []
    this.focusPanel()
    this.focusFeed()
  }

  unfocus() {
    utils.removeFocusedBrowsingCards()
    this.reset()
    try {
      this.setPanelVisibility(true)
      if (TwitterUtils.isHomePage(document.URL)) {
        this.setFeedVisibility(true)
      }
    } catch (err) {}
  }

  customFocus() {
    utils.removeFocusedBrowsingCards()
    this.reset()
    if (TwitterUtils.isHomePage(document.URL)) {
      this.setFeedVisibility(true)
    }
    this.focusPanel()
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    // We give the feed a second to populate so ads can be targeted
    setTimeout(this.focusFeedAds, 1000)
  }

  reset() {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.panelIntervalId)
    window.clearInterval(this.adIntervalId)
  }

  focusPanel() {
    this.tryHidingPanel()
    if (this.panelIntervalId) {
      window.clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = window.setInterval(() => {
      this.tryHidingPanel()
    }, 250)
  }

  focusFeed() {
    this.tryHidingFeed()
    if (this.feedIntervalId) {
      window.clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryHidingFeed()
    }, 250)
  }

  focusFeedAds() {
    this.hideFeedAds()
    if (this.adIntervalId) {
      window.clearInterval(this.adIntervalId)
    }
    // We set a longer timeout for ads to prevent the feed from infinitely loading new items
    this.adIntervalId = window.setInterval(() => {
      this.hideFeedAds()
    }, 10000)
  }

  setFeedVisibility(visible: boolean) {
    let feedContainer = TwitterUtils.getFeedContainer()
    if (!visible) {
      this.feed = feedContainer.children[0]
      feedContainer.removeChild(feedContainer.childNodes[0])
      TwitterIFrameUtils.injectFeedIframe(this.feedIframe, feedContainer)
    } else {
      if (this.feed) {
        feedContainer.append(this.feed)
      }
    }
  }

  setPanelVisibility(visibile: boolean) {
    let panelContainer = TwitterUtils.getPanelContainer()
    if (!visibile) {
      let length = panelContainer.children.length
      let currentPanelElements = []
      while (length != 1) {
        var currentLastChild = panelContainer.children[length - 1]
        currentPanelElements.push(currentLastChild)
        panelContainer.removeChild(currentLastChild)
        length -= 1
      }
      this.panelElements = currentPanelElements
    } else {
      for (let i = this.panelElements.length - 1; i >= 0; i -= 1) {
        panelContainer.append(this.panelElements[i])
      }
      this.panelElements = []
    }
  }

  tryHidingFeed() {
    try {
      let url = document.URL
      if (!TwitterUtils.isHomePage(url)) {
        return
      }
      if (TwitterUtils.isFeedHidden()) {
        return
      }
      if (TwitterUtils.hasFeedLoaded()) {
        this.setFeedVisibility(false)
        return
      }
    } catch (err) {}
  }

  tryHidingPanel() {
    try {
      if (TwitterUtils.isPanelHidden()) {
        return
      }

      if (TwitterUtils.hasPanelLoaded()) {
        this.setPanelVisibility(false)
        return
      }
    } catch (err) {}
  }

  hideFeedAds() {
    twitterUtils.getFeedAdElements().forEach((ad) => {
      ad.style.display = 'none'
    })
  }
}
