import LinkedInUtils from './linkedin-utils'
import LinkedInIFrameUtils from './linkedin-iframe-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import linkedinUtils from './linkedin-utils'

export default class LinkedInController extends WebsiteController {
  panelElements: Node[]
  feedIntervalId: number
  panelIntervalId: number
  feedIframe: HTMLIFrameElement
  feedChildNode: string | Node
  adChildNode: string | Node
  adIntervalId: number
  feedAdsIntervalId: number

  constructor() {
    super()
    this.panelElements = []
    this.feedChildNode = ''
    this.adChildNode = ''
    this.feedIntervalId = 0
    this.panelIntervalId = 0
    this.adIntervalId = 0
    this.feedAdsIntervalId = 0
    this.feedIframe = LinkedInIFrameUtils.createLinkedInIframe()
  }

  focus() {
    utils.clearElements(this.panelElements)
    this.focusFeed()
    this.focusPanel()
    this.focusAd()
  }

  unfocus() {
    let url = document.URL
    if (LinkedInUtils.isHomePage(url)) {
      this.clearIntervals()
      utils.removeFocusedBrowsingCards()
      this.setFeedVisibility(true)
      this.setPanelVisibility(true)
      this.setAdVisibility(true)
    }
  }

  premiumFocus() {
    utils.clearElements(this.panelElements)
    this.focusPanel()
    this.focusAd()
    this.focusFeedAds()
  }

  clearIntervals() {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.panelIntervalId)
    window.clearInterval(this.adIntervalId)
    window.clearInterval(this.feedAdsIntervalId)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryBlockingFeed()
    }, 250)
  }

  focusPanel() {
    if (this.panelIntervalId) {
      clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = window.setInterval(() => {
      this.tryBlockingPanel()
    }, 250)
  }

  focusAd() {
    if (this.adIntervalId) {
      clearInterval(this.adIntervalId)
    }
    this.adIntervalId = window.setInterval(() => {
      this.tryBlockingAd()
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

  setAdVisibility(visibile: boolean) {
    let adParentNode = LinkedInUtils.getAdHeader()
    if (!visibile) {
      this.adChildNode = adParentNode.children[0]
      adParentNode.removeChild(this.adChildNode)
    } else {
      adParentNode.append(this.adChildNode)
    }
  }

  setFeedVisibility(visibile: boolean) {
    let feedParentNode = LinkedInUtils.getLinkedInFeed()
    if (!visibile) {
      this.feedChildNode = feedParentNode.children[1]
      feedParentNode.removeChild(this.feedChildNode)
      LinkedInIFrameUtils.injectFeedIframe(this.feedIframe, feedParentNode)
    } else {
      feedParentNode.append(this.feedChildNode)
    }
  }

  setPanelVisibility(visible: boolean) {
    let panel = LinkedInUtils.getLinkedInPanel()
    if (!visible) {
      let length = panel.children.length

      let currentPanelElements = []
      while (length != 1) {
        var currentLastChild = panel.children[length - 1]
        currentPanelElements.push(currentLastChild)
        panel.removeChild(currentLastChild)
        length -= 1
      }
      this.panelElements = currentPanelElements
    } else {
      for (let i = this.panelElements.length - 1; i >= 0; i -= 1) {
        panel.append(this.panelElements[i])
      }
      utils.clearElements(this.panelElements)
    }
  }

  tryBlockingAd() {
    try {
      let url = document.URL
      if (!LinkedInUtils.isHomePage(url)) {
        return
      }
      if (LinkedInUtils.isAdHidden()) {
        return
      }
      if (LinkedInUtils.hasAdLoaded()) {
        this.setAdVisibility(false)
        return
      }
    } catch (err) {}
  }

  tryBlockingFeed() {
    try {
      let url = document.URL
      if (!LinkedInUtils.isHomePage(url)) {
        return
      }
      if (LinkedInUtils.isFeedHidden()) {
        return
      }
      if (LinkedInUtils.hasFeedLoaded()) {
        this.setFeedVisibility(false)
        return
      }
    } catch (err) {}
  }

  tryBlockingPanel() {
    try {
      let url = document.URL
      if (!LinkedInUtils.isHomePage(url)) {
        return
      }

      if (LinkedInUtils.isPanelHidden()) {
        return
      }
      if (LinkedInUtils.hasPanelLoaded()) {
        this.setPanelVisibility(false)
        return
      }
    } catch (err) {}
  }

  hideFeedAds() {
    linkedinUtils.getFeedAdElements().forEach((ad) => {
      console.log('hiding ad')
      ad.style.display = 'none'
    })
  }
}
