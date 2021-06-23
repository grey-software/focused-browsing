const TWITTER_FEED_FRAME_HEIGHT = "766px";
const TWITTER_FEED_FRAME_WIDTH = "598px";

const TWITTER_PANEL_FRAME_HEIGHT = "4000px";
const TWITTER_PANEL_FRAME_WIDTH = "350px";
const IFRAME_ClASS = "focus-card";


function createTwitterFeedIframe() {
    let feedIframe = document.createElement("iframe")

    feedIframe.width = TWITTER_FEED_FRAME_WIDTH;
    feedIframe.height = TWITTER_FEED_FRAME_HEIGHT;
    feedIframe.className = IFRAME_ClASS;

    Object.assign(feedIframe.style, {
      position: "inherit",
      border: "none",
    });

    return feedIframe
}

function createTwitterPanelIframe(){
  let panelIframe = document.createElement("iframe")

  panelIframe.width = TWITTER_PANEL_FRAME_WIDTH;
  panelIframe.height = TWITTER_PANEL_FRAME_HEIGHT;
  panelIframe.className = IFRAME_ClASS;

  Object.assign(panelIframe.style, {
    position: "fixed",
    border: "none",
  });

  return panelIframe
}


function setFeedIframeSource(feedIframe) {
    if (document.body.style.backgroundColor == "rgb(0, 0, 0)") {
      feedIframe.src = chrome.runtime.getURL("www/twitter/feed/twitterFeedDark.html")
    } else if (document.body.style.backgroundColor == "rgb(21, 32, 43)") {
      feedIframe.src = chrome.runtime.getURL("www/twitter/feed/twitterFeedDim.html")
    } else {
      feedIframe.src = chrome.runtime.getURL("www/twitter/feed/twitterFeed.html")
    }
}

function setPanelIframeSource(panelIframe) {
    if (document.body.style.backgroundColor == "rgb(0, 0, 0)" || document.body.style.backgroundColor == "rgb(21, 32, 43)") {
      panelIframe.src = chrome.runtime.getURL("www/twitter/panel/twitterPanelDark.html")
    } else {
      panelIframe.src = chrome.runtime.getURL("www/twitter/panel/twitterPanel.html")
    }
}

module.exports = {createTwitterFeedIframe,createTwitterPanelIframe, setFeedIframeSource, setPanelIframeSource}
