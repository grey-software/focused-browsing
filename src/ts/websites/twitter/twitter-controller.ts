import TwitterUtils from './twitter-utils'
import TwitterIFrameUtils from './twitter-iframe-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import twitterUtils from './twitter-utils'

export default class TwitterController extends WebsiteController {
  panel_elements: Node[]
  twitterFeedChildNode: string | Node
  feedIntervalId: number
  panelIntervalId: number
  adIntervalId: number
  feedIframe: HTMLIFrameElement
  constructor() {
    super()
    this.panel_elements = []
    this.twitterFeedChildNode = ''

    this.feedIntervalId = 0
    this.panelIntervalId = 0
    this.adIntervalId = 0
    this.feedIframe = TwitterIFrameUtils.createTwitterFeedIframe()
  }

  focus() {
    // the panel shows up on every page
    // we should clear our panel elements every time we focus because it can get over populated and we can be rendering extra elements
    utils.clearElements(this.panel_elements)
    this.focusPanel()
    this.focusFeed()
  }

  unfocus() {
    utils.removeFocusedBrowsingCards()
    let url = document.URL
    try {
      if (url.includes('twitter.com')) {
        if (TwitterUtils.isHomePage(url)) {
          this.setFeedVisibility(true)
        }
        this.setPanelVisibility(true)
        this.clearIntervals()
      }
    } catch (err) {}
  }

  premiumFocus() {
    utils.clearElements(this.panel_elements)
    this.focusPanel()
    this.focusAds()
  }

  clearIntervals() {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.panelIntervalId)
    window.clearInterval(this.adIntervalId)
  }

  focusPanel() {
    if (this.panelIntervalId) {
      window.clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = window.setInterval(() => {
      this.tryBlockingPanel()
    }, 250)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      window.clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryBlockingFeed()
    }, 250)
  }

  focusAds() {
    if (this.adIntervalId) {
      window.clearInterval(this.adIntervalId)
    }
    this.adIntervalId = window.setInterval(() => {
      this.hideAds()
    }, 250)
  }

  setFeedVisibility(visible: boolean) {
    let feed = TwitterUtils.getTwitterFeed()
    if (!visible) {
      this.twitterFeedChildNode = feed.children[0]
      feed.removeChild(feed.childNodes[0])
      TwitterIFrameUtils.injectFeedIframe(this.feedIframe, feed)
    } else {
      feed.append(this.twitterFeedChildNode)
    }
  }

  setPanelVisibility(visibile: boolean) {
    let panel = TwitterUtils.getTwitterPanel()
    if (!visibile) {
      let length = panel.children.length
      let current_panel_elements = []
      while (length != 1) {
        var currentLastChild = panel.children[length - 1]
        current_panel_elements.push(currentLastChild)
        panel.removeChild(currentLastChild)
        length -= 1
      }
      this.panel_elements = current_panel_elements
    } else {
      for (let i = this.panel_elements.length - 1; i >= 0; i -= 1) {
        panel.append(this.panel_elements[i])
      }
      utils.clearElements(this.panel_elements)
    }
  }

  tryBlockingFeed() {
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

  tryBlockingPanel() {
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

  hideAds() {
    twitterUtils.getAdElements().forEach((ad) => {
      console.log('hiding ad')
      ad.style.display = 'none'
    })
  }
}
