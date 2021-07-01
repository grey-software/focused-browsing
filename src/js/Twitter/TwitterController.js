import TwitterUtils from './TwitterUtils'
import TwitterIFrameUtils from './TwitterIFrameUtils'
import utils from '../utils'

export default class TwitterController {
  constructor() {
    this.panel_elements = []
    this.twitterFeedChildNode = null

    this.feedIntervalId = 0
    this.pageInterval = 0
    this.initialLoad = false

    this.feedIframe = TwitterIFrameUtils.createTwitterFeedIframe()
    this.blockFeedAttemptCount = 0
    this.blockPanelAttemptCount = 0
  }

  focus(url) {
    // the panel shows up on every page
    this.focusPanel()
    if (TwitterUtils.isHomePage(url)) {
      this.focusFeed()
    }
  }

  unfocus(url) {
    utils.removeFocusedBrowsingCards()
    this.setPanelVisibility(true)
    if (TwitterUtils.isHomePage(url)) {
      this.setFeedVisibility(true)
    }
  }

  clearTwitterElements() {
    this.panel_elements = []
  }

  focusPanel() {
    try{
      console.log("trying to focus panel right away")
      this.setPanelVisibility(false)
    }catch(err){
      console.log("setting interval to hide panel")
      this.pageInterval = setInterval(this.tryBlockingPanel.bind(this), 700)
    }
  }

  focusFeed() {

    try{
      this.setFeedVisibility(false)
    }catch(err){
      this.feedIntervalId = setInterval(this.tryBlockingFeed.bind(this), 250)
    }
    // this.feedIntervalId = setInterval(this.tryBlockingFeed.bind(this), 500)
  }

  setFeedVisibility(visible) {
    let feed = TwitterUtils.getTwitterFeed()
    if (!visible) {
      this.twitterFeedChildNode = feed.children[0]
      feed.removeChild(feed.childNodes[0])
      TwitterIFrameUtils.injectFeedIframe(this.feedIframe, feed)
    } else {
      console.log("setting feed visibility to true")
      console.log(feed)
      console.log(this.twitterFeedChildNode)
      feed.append(this.twitterFeedChildNode)
    }
  }

  setPanelVisibility(visibile) {
    let panel = TwitterUtils.getTwitterPanel()
    if (!visibile) {
      let length = panel.children.length

      while (length != 1) {
        var currentLastChild = panel.lastChild
        this.panel_elements.push(currentLastChild)
        panel.removeChild(currentLastChild)
        length -= 1
      }
    } else {
      for (let i = this.panel_elements.length - 1; i >= 0; i -= 1) {
        panel.append(this.panel_elements[i])
      }
      this.clearTwitterElements()
    }
  }

  tryBlockingFeed() {
    try {
      if (TwitterUtils.hasFeedLoaded()) {
        this.setFeedVisibility(false)
        clearInterval(this.feedIntervalId)
        this.initialLoad = false
        return
      }
    } catch (err) {
      this.blockFeedAttemptCount += 1
      if (this.blockFeedAttemptCount > 2 && this.blockFeedAttemptCount <= 4) {
        console.log('WARNING: Twitter Feed usually load by now')
      } else if (this.blockFeedAttemptCount > 4 && this.blockFeedAttemptCount <= 8) {
        console.log('ERROR: Something Wrong with the Twitter Feed')
      } else if (this.blockFeedAttemptCount > 8) {
        clearInterval(this.feedIntervalId)
      }
    }
  }

  tryBlockingPanel() {
    try {
      if (TwitterUtils.hasPanelLoaded()) {
        this.setPanelVisibility(false)
        clearInterval(this.pageInterval)
        return
      }
    } catch (err) {
      this.blockPanelAttemptCount += 1
      if (this.blockPanelAttemptCount > 2 && this.blockPanelAttemptCount <= 4) {
        console.log('WARNING: Twitter Panel usually load by now')
      } else if (this.blockPanelAttemptCount > 4 && this.blockPanelAttemptCount <= 8) {
        console.log('ERROR: Something Wrong with the Twitter Panel')
      } else if (this.blockPanelAttemptCount > 8) {
        clearInterval(this.pageInterval)
      }
    }
  }
}
