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
    console.log(url)
    this.focusTwitterPanel()
    if (TwitterUtils.isHomePage(url)) {
      this.focusTwitterFeed()
    }
  }

  unfocus(url) {
    utils.removeFocusedBrowsingCards()
    this.toggleTwitterPanel(false)
    if (url.includes("/home")) {
      this.toggleTwitterFeed(false)
    }
  }


  clearTwitterElements() {
    this.panel_elements = []
  }

  focusTwitterPanel() {
    this.pageInterval = setInterval(this.tryHidingTwitterPanel.bind(this), 700);
  }

  focusTwitterFeed() {
    this.feedIntervalId = setInterval(this.tryHidingTwitterFeed.bind(this), 500);
  }

  toggleTwitterFeed(shouldhide) {
    let feed = TwitterUtils.getTwitterFeed()
    if (shouldhide) {
      this.twitterFeedChildNode = feed.children[0]
      feed.removeChild(feed.childNodes[0])
    } else {
      feed.append(this.twitterFeedChildNode)
    }
  }

  toggleTwitterPanel(shouldHide) {

    let panel = TwitterUtils.getTwitterPanel()
    if (shouldHide) {
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

  tryHidingTwitterFeed() {
    try {
      TwitterIFrameUtils.setFeedIframeSource(this.feedIframe)
      let feed = TwitterUtils.getTwitterFeed()

      if (TwitterUtils.hasFeedLoaded()) {
        this.toggleTwitterFeed(true);
        feed.append(this.feedIframe)
        clearInterval(this.feedIntervalId);
        this.initialLoad = false;
        return
      }

    } catch (err) {
      this.blockFeedAttemptCount += 1
      if (this.blockFeedAttemptCount > 2 && this.blockFeedAttemptCount <= 4) {
        console.log("WARNING: Twitter Feed usually load by now")
      } else if (this.blockFeedAttemptCount > 4 && this.blockFeedAttemptCount <= 8) {
        console.log("ERROR: Something Wrong with the Twitter Feed")
      } else if (this.blockFeedAttemptCount > 8){
        clearInterval(this.feedIntervalId);
      }
    }
  }

  tryHidingTwitterPanel() {
    try {
      if (TwitterUtils.hasPanelLoaded()) {
        this.toggleTwitterPanel(true);
        clearInterval(this.pageInterval);
        return
      }

    } catch (err) {
      this.blockPanelAttemptCount += 1
      if (this.blockPanelAttemptCount > 2 && this.blockPanelAttemptCount <= 4) {
        console.log("WARNING: Twitter Panel usually load by now")
      } else if (this.blockPanelAttemptCount > 4 && this.blockPanelAttemptCount <= 8) {
        console.log("ERROR: Something Wrong with the Twitter Panel")
      } else if (this.blockPanelAttemptCount > 8) {
        clearInterval(this.pageInterval);
      }
    }
  }

}