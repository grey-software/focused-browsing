import TwitterUtils from './TwitterUtils'
import utils from '../utils'
export default class TwitterController {


  constructor(port) {
    this.port = port
    this.panel_elements = []
    this.twitterFeedChildNode = null

    this.feedIntervalId = 0
    this.pageInterval = 0
    this.initialLoad = false
    this.TWITTER_FEED_FRAME_HEIGHT = "1000px";
    this.TWITTER_FEED_FRAME_WIDTH = "598px";

    this.TWITTER_PANEL_FRAME_HEIGHT = "4000px";
    this.TWITTER_PANEL_FRAME_WIDTH = "350px";
    this.IFRAME_ClASS = "focus-card";

    let iframes = this.createTwitterIframes()
    this.feedIframe = iframes[0]
    this.panelIframe = iframes[1]

    this.blockAttemptCount = 0
  }

  handleActionOnPage(url, action) {
    if (action == "focus") {
      this.focus(url)
    } else {
      this.unfocus(url)
    }
  }

  focus(url) {
    // the panel shows up on every page
    this.focusTwitterPanel()
    if (url.includes("/home")) {
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



  createTwitterIframes() {
    let feedIframe = document.createElement("iframe")
    let panelIframe = document.createElement("iframe")

    feedIframe.width = this.TWITTER_FEED_FRAME_WIDTH;
    feedIframe.height = this.TWITTER_FEED_FRAME_HEIGHT;
    feedIframe.className = this.IFRAME_ClASS;

    panelIframe.width = this.TWITTER_PANEL_FRAME_WIDTH;
    panelIframe.height = this.TWITTER_PANEL_FRAME_HEIGHT;
    panelIframe.className = this.IFRAME_ClASS;

    Object.assign(feedIframe.style, {
      position: "fixed",
      border: "none",
    });


    Object.assign(panelIframe.style, {
      position: "fixed",
      border: "none",
    });
    return [feedIframe, panelIframe]
  }

  clearTwitterElements() {
    this.twitterFeedChildNode = null
    this.panel_elements = []
  }

  focusTwitterPanel() {
    this.pageInterval = setInterval(this.tryHidingTwitterPanel.bind(this), 700);
  }

  setFeedIframeSource() {
    if (document.body.style.backgroundColor == "rgb(0, 0, 0)") {
      this.feedIframe.src = chrome.runtime.getURL("www/twitter/feed/twitterFeedDark.html")
    } else if (document.body.style.backgroundColor == "rgb(21, 32, 43)") {
      this.feedIframe.src = chrome.runtime.getURL("www/twitter/feed/twitterFeedDim.html")
    } else {
      this.feedIframe.src = chrome.runtime.getURL("www/twitter/feed/twitterFeed.html")
    }
  }

  setPanelIframeSource() {
    if (document.body.style.backgroundColor == "rgb(0, 0, 0)" || document.body.style.backgroundColor == "rgb(21, 32, 43)") {
      this.panelIframe.src = chrome.runtime.getURL("www/twitter/panel/twitterPanelDark.html")
    } else {
      this.panelIframe.src = chrome.runtime.getURL("www/twitter/panel/twitterPanel.html")
    }
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
    }
  }

  tryHidingTwitterFeed() {
    try {
      if (this.isFeedHidden()) {
        clearInterval(this.feedIntervalId);
        this.initialLoad = false;
        return
      } else {
        this.toggleTwitterFeed(true);

        this.setFeedIframeSource()
        let feed = TwitterUtils.getTwitterFeed()
        feed.append(this.feedIframe)
      }
    } catch (err) {
      this.blockAttemptCount += 1
      if (this.blockAttemptCount > 2) {
        utils.sendLogToBackground(this.port, "WARNING: Twitter elements usually load by now")
      } else if (this.blockAttemptCount > 4 && this.blockAttemptCount < 8) {
        utils.sendLogToBackground(this.port, "ERROR: Something Wrong with the twitter elements")
      } else if (this.blockAttemptCount > 8){
        clearInterval(this.feedIntervalId);
      }
    }
  }

  tryHidingTwitterPanel() {
    try {
      if (this.isPanelHidden()) {
        clearInterval(this.pageInterval);
        return
      } else {
        this.toggleTwitterPanel(true);

        this.setPanelIframeSource()
        let panel = TwitterUtils.getTwitterPanel()
        panel.append(this.panelIframe)
      }
    } catch (err) {
      this.blockAttemptCount += 1
      if (this.blockAttemptCount > 2) {
        utils.sendLogToBackground(this.port, "WARNING: Twitter elements usually load by now")
      } else if (this.blockAttemptCount > 4 && this.blockAttemptCount < 8) {
        utils.sendLogToBackground(this.port, "ERROR: Something Wrong with the twitter elements")
      } else if (this.blockAttemptCount > 8) {
        clearInterval(this.pageInterval);
      }
    }
  }

  isFeedHidden() {
    let feed = TwitterUtils.getTwitterFeed()
    return feed.children[0].nodeName == "IFRAME"
  }

  isPanelHidden() {
    let panel = TwitterUtils.getTwitterPanel()
    return panel.children.length == 2;
  }

}