import LinkedInUtils from './linkedin-utils'
import LinkedInIFrameUtils from './linkedin-iframe-utils'
import utils from '../../utils'
import WebsiteController from '../website-controller'
import linkedinUtils from './linkedin-utils'

export default class LinkedInController extends WebsiteController {
  feedIntervalId: number = 0
  panelIntervalId: number = 0
  adIntervalId: number = 0
  feedAdsIntervalId: number = 0

  panelElements: Element[] = []
  feed: null | Element = null
  bannerAd: null | Element = null
  feedIframe: HTMLIFrameElement

  constructor() {
    super()
    this.feedIframe = LinkedInIFrameUtils.createLinkedInIframe()
  }

  focus() {
    this.panelElements = []
    this.focusFeed()
    this.focusPanel()
    this.focusAd()
  }

  unfocus() {
    let url = document.URL
    if (LinkedInUtils.isHomePage(url)) {
      this.reset()
      utils.removeFocusedBrowsingCards()
      this.showFeed()
      this.showPanel()
      this.showBannerAd()
    }
  }

  customFocus() {
    window.clearInterval(this.feedIntervalId)
    utils.removeFocusedBrowsingCards()
    this.showFeed()
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    // We give the feed a second to populate so ads can be targeted
    setTimeout(this.focusFeedAds, 1000)
  }

  reset() {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.panelIntervalId)
    window.clearInterval(this.adIntervalId)
    window.clearInterval(this.feedAdsIntervalId)
  }

  focusFeed() {
    this.tryHidingFeed()
    if (this.feedIntervalId) {
      clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryHidingFeed()
    }, 250)
  }

  focusPanel() {
    this.tryHidingPanel()
    if (this.panelIntervalId) {
      clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = window.setInterval(() => {
      this.tryHidingPanel()
    }, 250)
  }

  focusAd() {
    this.tryHidingAd()
    if (this.adIntervalId) {
      clearInterval(this.adIntervalId)
    }
    this.adIntervalId = window.setInterval(() => {
      this.tryHidingAd()
    }, 250)
  }

  focusFeedAds() {
    if (this.feedAdsIntervalId) {
      window.clearInterval(this.feedAdsIntervalId)
    }
    this.adIntervalId = window.setInterval(() => {
      this.hideFeedAds()
    }, 250)
  }

  tryHidingAd() {
    try {
      let url = document.URL
      if (!LinkedInUtils.isHomePage(url)) {
        return
      }
      if (LinkedInUtils.isAdHidden()) {
        return
      }
      if (LinkedInUtils.hasAdLoaded()) {
        this.hideBannerAd()
        return
      }
    } catch (err) {}
  }

  tryHidingFeed() {
    try {
      let url = document.URL
      if (!LinkedInUtils.isHomePage(url)) {
        return
      }
      if (LinkedInUtils.isFeedHidden()) {
        return
      }
      if (LinkedInUtils.hasFeedLoaded()) {
        this.hideFeed()
        return
      }
    } catch (err) {}
  }

  tryHidingPanel() {
    try {
      let url = document.URL
      if (!LinkedInUtils.isHomePage(url)) {
        return
      }

      if (LinkedInUtils.isPanelHidden()) {
        return
      }
      if (LinkedInUtils.hasPanelLoaded()) {
        this.hidePanel()
        return
      }
    } catch (err) {}
  }

  hideFeed() {
    let feedParentNode = LinkedInUtils.getLinkedInFeed()
    this.feed = feedParentNode.children[1]
    feedParentNode.removeChild(this.feed)
    LinkedInIFrameUtils.injectFeedIframe(this.feedIframe, feedParentNode)
  }

  showFeed() {
    let feedParentNode = LinkedInUtils.getLinkedInFeed()
    if (this.feed) {
      feedParentNode.append(this.feed)
    }
  }

  hidePanel() {
    let panel = LinkedInUtils.getLinkedInPanel()
    let length = panel.children.length

    let currentPanelElements = []
    while (length != 1) {
      var currentLastChild = panel.children[length - 1]
      currentPanelElements.push(currentLastChild)
      panel.removeChild(currentLastChild)
      length -= 1
    }
    this.panelElements = currentPanelElements
  }

  showPanel() {
    let panel = LinkedInUtils.getLinkedInPanel()
    for (let i = this.panelElements.length - 1; i >= 0; i -= 1) {
      panel.append(this.panelElements[i])
    }
    this.panelElements = []
  }

  showBannerAd() {
    let adParentNode = LinkedInUtils.getAdHeader()
    this.bannerAd = adParentNode.children[0]
    adParentNode.removeChild(this.bannerAd)
  }

  hideBannerAd() {
    let adParentNode = LinkedInUtils.getAdHeader()
    if (this.bannerAd) {
      adParentNode.append(this.bannerAd)
    }
  }

  hideFeedAds() {
    linkedinUtils.getFeedAdElements().forEach((ad) => {
      console.log('hiding ad')
      ad.style.display = 'none'
    })
  }
}
