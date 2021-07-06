import TwitterUtils from './TwitterUtils'
import TwitterIFrameUtils from './TwitterIFrameUtils'
import utils from '../utils'

export default class TwitterController {
  constructor() {
    this.panel_elements = []
    this.twitterFeedChildNode = null

    this.feedIntervalId = null
    this.panelIntervalId = null

    this.feedIframe = TwitterIFrameUtils.createTwitterFeedIframe()
  }

  focus(url) {
    // the panel shows up on every page
    this.focusPanel()
    if (TwitterUtils.isHomePage(url)) {
      this.focusFeed()
    }
  }

  unfocus(url) {
    clearInterval(this.feedIntervalId)
    clearInterval(this.panelIntervalId)
    utils.removeFocusedBrowsingCards()
    this.setPanelVisibility(true)
    if (TwitterUtils.isHomePage(url)) {
      this.setFeedVisibility(true)
    }
  }

  focusPanel() {
    if (this.panelIntervalId) {
      clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = setInterval(this.tryBlockingPanel.bind(this), 700)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = setInterval(this.tryBlockingFeed.bind(this), 250)
  }

  setFeedVisibility(visible) {
    let feed = TwitterUtils.getTwitterFeed()
    if (!visible) {
      this.twitterFeedChildNode = feed.children[0]
      feed.removeChild(feed.childNodes[0])
      TwitterIFrameUtils.injectFeedIframe(this.feedIframe, feed)
    } else {
      console.log('setting feed visibility to true')
      console.log(feed)
      console.log(this.twitterFeedChildNode)
      feed.append(this.twitterFeedChildNode)
    }
  }

  setPanelVisibility(visibile) {
    let panel = TwitterUtils.getTwitterPanel()
    if (!visibile) {
      let length = panel.children.length

      let current_panel_elements = []
      while (length != 1) {
        var currentLastChild = panel.lastChild
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
}
