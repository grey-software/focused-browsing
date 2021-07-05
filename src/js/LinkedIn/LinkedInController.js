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
    this.initialLoad = false
    this.blockFeedAttemptCount = 0
    this.blockPanelAttemptCount = 0
    this.feedIframe = null
  }

  clearLinkedInElements() {
    this.panel_elements = []
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
      this.clearLinkedInElements()
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
      // this.blockAdAttemptCount += 1
      // if (this.blockAdAttemptCount > 2 && this.blockAdAttemptCount <= 4) {
      //   console.log('WARNING: LinkedIn elements usually load by now')
      // } else if (this.blockAdAttemptCount > 4 && this.blockAdAttemptCount < 8) {
      //   console.log('ERROR: Something Wrong with the LinkedIn elements')
      // } else if (this.blockAdAttemptCount > 8) {
      //   clearInterval(this.adIntervalId)
      // }
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
      // this.blockFeedAttemptCount += 1
      // if (this.blockFeedAttemptCount > 2 && this.blockFeedAttemptCount <= 4) {
      //   console.log('WARNING: LinkedIn elements usually load by now')
      // } else if (this.blockFeedAttemptCount > 4 && this.blockFeedAttemptCount < 8) {
      //   console.log('ERROR: Something Wrong with the LinkedIn elements')
      // } else if (this.blockFeedAttemptCount > 8) {
      //   clearInterval(this.feedIntervalId)
      // }
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
      // this.blockPanelAttemptCount += 1
      // if (this.blockPanelAttemptCount > 2 && this.blockPanelAttemptCount <= 4) {
      //   console.log('WARNING: LinkedIn elements usually load by now')
      // } else if (this.blockPanelAttemptCount > 4 && this.blockPanelAttemptCount < 8) {
      //   console.log('ERROR: Something Wrong with the LinkedIn elements')
      // } else if (this.blockPanelAttemptCount > 8) {
      //   clearInterval(this.panelIntervalId)
      // }
    }
  }
}
