import TwitterUtils from './TwitterUtils'
import TwitterIFrameUtils from './TwitterIFrameUtils'
import utils from '../utils'

export default class TwitterController {
  panel_elements: Node[]
  twitterFeedChildNode: string | Node
  feedIntervalId: number
  panelIntervalId: number
  feedIframe: HTMLIFrameElement
  constructor() {
    this.panel_elements = []
    this.twitterFeedChildNode = ''

    this.feedIntervalId = 0
    this.panelIntervalId = 0
    this.feedIframe = TwitterIFrameUtils.createTwitterFeedIframe()
  }

  focus(url: string) {
    // the panel shows up on every page

    this.focusPanel()
    if (TwitterUtils.isHomePage(url)) {
      this.focusFeed()
    }
  }

  unfocus(url: string) {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.panelIntervalId)
    utils.removeFocusedBrowsingCards()
    this.setPanelVisibility(true)
    if (TwitterUtils.isHomePage(url)) {
      this.setFeedVisibility(true)
    }
  }

  focusPanel() {
    if (this.panelIntervalId) {
      window.clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = window.setInterval(this.tryBlockingPanel.bind(this), 250)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      window.clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(this.tryBlockingFeed.bind(this), 250)
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
      console.log("length of panel is: " + length)
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
      utils.clearPanelElements(this.panel_elements)
    }
  }

  tryBlockingFeed() {
    try {
      if (TwitterUtils.isFeedHidden()) {
        return
      }
      if (TwitterUtils.hasFeedLoaded()) {
        this.setFeedVisibility(false)
        return
      }
    } catch (err) { }
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
    } catch (err) { }
  }
}
