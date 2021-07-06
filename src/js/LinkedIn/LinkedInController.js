import LinkedInUtils from './LinkedInUtils'
import LinkedInIFrameUtils from './LinkedInIFrameUtils'
import utils from '../utils'

export default class LinkedInController {
  constructor() {
    this.panel_elements = []
    this.linkedin_feed_child_node = null
    this.linkedin_ad_child_node = null
    this.feedIntervalId = 0
    this.panelIntervalId = 0
    this.adIntervalId = 0
    this.feedIframe = null
  }

  focus(url) {
    if (LinkedInUtils.isHomePage(url)) {
      this.feedIframe = LinkedInIFrameUtils.createLinkedInIframe()
      this.focusFeed()
      this.focusPanel()
      this.focusAd()
    }
  }

  unfocus(url) {
    clearInterval(this.feedIntervalId)
    clearInterval(this.panelIntervalId)
    clearInterval(this.adIntervalId)
    utils.removeFocusedBrowsingCards()

    this.setFeedVisibility(true)
    this.setPanelVisibility(true)
    this.setAdVisibility(true)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = setInterval(this.tryBlockingFeed.bind(this), 250)
  }

  focusPanel() {
    if (this.panelIntervalId) {
      clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = setInterval(this.tryBlockingPanel.bind(this), 250)
  }

  focusAd() {
    if (this.adIntervalId) {
      clearInterval(this.adIntervalId)
    }
    this.adIntervalId = setInterval(this.tryBlockingAd.bind(this), 250)
  }

  setAdVisibility(visibile) {
    var linkedin_ad_parent_node = LinkedInUtils.getAdHeader()
    if (!visibile) {
      this.linkedin_ad_child_node = linkedin_ad_parent_node.children[0]
      linkedin_ad_parent_node.removeChild(this.linkedin_ad_child_node)
    } else {
      linkedin_ad_parent_node.append(this.linkedin_ad_child_node)
    }
  }

  setFeedVisibility(visibile) {
    var linkedin_feed_parent_node = LinkedInUtils.getLinkedInFeed()
    if (!visibile) {
      this.linkedin_feed_child_node = linkedin_feed_parent_node.children[1]
      linkedin_feed_parent_node.removeChild(this.linkedin_feed_child_node)
      LinkedInIFrameUtils.injectFeedIframe(this.feedIframe, linkedin_feed_parent_node)
    } else {
      linkedin_feed_parent_node.append(this.linkedin_feed_child_node)
    }
  }

  setPanelVisibility(visible) {
    let panel = LinkedInUtils.getLinkedInPanel()
    if (!visible) {
      let length = panel.children.length

      let current_panel_elements = []
      while (length != 0) {
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

  tryBlockingAd() {
    try {
      if (LinkedInUtils.isAdHidden()) {
        return
      }
      if (LinkedInUtils.hasAdLoaded()) {
        this.setAdVisibility(false)
        return
      }
    } catch (err) {
    }
  }

  tryBlockingFeed() {
    try {
      if (LinkedInUtils.isFeedHidden()) {
        return
      }
      if (LinkedInUtils.hasFeedLoaded()) {
        this.setFeedVisibility(false)
        return
      }
    } catch (err) {
    }
  }

  tryBlockingPanel() {
    try {
      if (LinkedInUtils.isPanelHidden()) {
        return
      }
      if (LinkedInUtils.hasPanelLoaded()) {
        this.setPanelVisibility(false)
        return
      }
    } catch (err) {
    }
  }
}
