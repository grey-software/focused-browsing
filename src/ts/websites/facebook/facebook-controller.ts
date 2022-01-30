import FacebookUtils from './facebook-utils'
import FaceBookIFrameUtils from './facebook-iframe-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import facebookUtils from './facebook-utils'

export default class FaceBookController extends WebsiteController {
  panelElements: Node[]
  facebookFeedChildNode: string | Node
  feedIntervalId: number
  feedIframe: HTMLIFrameElement
  constructor() {
    super()
    this.panelElements = []
    this.facebookFeedChildNode = ''
    this.feedIntervalId = 0
    this.feedIframe = FaceBookIFrameUtils.createFaceBookFeedIframe()
  }

  focus() {
    // the panel shows up on every page
    // we should clear our panel elements every time we focus because it can get over populated and we can be rendering extra elements
    utils.clearElements(this.panelElements)
    this.focusFeed()
  }

  unfocus() {
    utils.removeFocusedBrowsingCards()
    let url = document.URL
    try {
      if (url.includes('facebook.com')) {
        if (FacebookUtils.isHomePage(url)) {
          this.setFeedVisibility(true)
        }
        this.clearIntervals()
      }
    } catch (err) {}
  }

  premiumFocus() {
    utils.clearElements(this.panelElements)
  }

  clearIntervals() {
    window.clearInterval(this.feedIntervalId)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      window.clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryBlockingFeed()
    }, 250)
  }

  setFeedVisibility(visible: boolean) {
    let feed = facebookUtils.getFacebookFeed()
    if (!visible) {
      this.facebookFeedChildNode = feed
      feed.removeChild(feed.childNodes[0])
      FaceBookIFrameUtils.injectFeedIframe(this.feedIframe, feed)
    } else {
      feed.append(this.facebookFeedChildNode)
    }
  }

  tryBlockingFeed() {
    try {
      let url = document.URL
      if (!FacebookUtils.isHomePage(url)) {
        return
      }
      if (FacebookUtils.isFeedHidden()) {
        return
      }
      if (FacebookUtils.hasFeedLoaded()) {
        this.setFeedVisibility(false)
        return
      }
    } catch (err) {}
  }
}
