// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks
const TWITTER_FEED_CLASS = "css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu";
const TWITTER_PANEL_CLASS = "css-1dbjc4n r-1ihkh82 r-1in3vh1 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x"




const NEWS_FEED_CLASSNAME = "core-rail"
const SHARED_NEWS_CLASSNAME = "ad-banner-container artdeco-card ember-view"
const MAIN_CONTAINER_CLASSNAME = "neptune-grid three-column ghost-animate-in"
const LINKEDIN_NEWS = "news-module pv3 ember-view"

const HOME_PAGE_CLASS = "self-focused ember-view"

const
  iFrame = document.createElement('iframe'),
  defaultFrameHeight = '100px',
  defaultFrameWidth = '120px'


const currentUrl = window.location.href

var hidden = false; 
var initialLoad = true;
export default function attachContentHooks (bridge) {
    // handle event
  bridge.on('focus', function (event) {
    console.log("for event focus")
    let currentUrl = event.data.page


    if (currentUrl == "twitter"){
      console.log("about to enter focus on Twitter")
      blockFeedAndPanelTwitter()
    }
    else if(currentUrl == "linkedin"){
      console.log("about to focus on linkedin")
      hideLinkedIn(true)
    }
  })

  bridge.on('un-focus', function (event) { 
    console.log("for event un-focus")
    console.log(event)
    let currentUrl = event.data.page

    if (currentUrl == "twitter"){
      console.log("about to un-focus on Twitter")
      hideTwitterDistractions(false)
    }
    else if(currentUrl == "linkedin"){
      console.log("about to un-focus on linkedin")
      hideLinkedIn(false)
    } 
  })


}


const setIFrameDimensions = (height, width) => {
  iFrame.height = height
  iFrame.width = width
  document.body.style.paddingLeft = width
}

// create iframe
function createIframe () {
  // const iframe = document.createElement('iframe')
  // iframe.width = '120px'
  // iframe.height = '100px'
  setIFrameDimensions(defaultFrameHeight, defaultFrameWidth)
  Object.assign(iFrame.style, {
    position: 'fixed',
    border: 'none',
    zIndex: '10000'
  })

  iFrame.src = chrome.runtime.getURL('www/index.html')
  console.log(iFrame.src)
  return iFrame
}



function hideLinkedIn(hide){
  try {
    if(hide){
      document.getElementsByClassName(HOME_PAGE_CLASS)[0].style.visibility = "hidden"
    }else{
      document.getElementsByClassName(HOME_PAGE_CLASS)[0].style.visibility = "visible"
    }
  }catch(err) {
    console.log(err)
  }

}

var hidden = false
function hideTwitterDistractions(hide){
  try { 
    if(hide){
      document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[0].children[0].children[3].style.visibility = "hidden"
      document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[1].children[0].children[1].children[0].children[0].children[0].children[2].style.visibility = "hidden"
      hidden = true;
    }else{
      document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[0].children[0].children[3].style.visibility = "visible"
      document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[1].children[0].children[1].children[0].children[0].children[0].children[2].style.visibility = "visible"
    }
  }catch(err){
    console.log(err)
  }
}


var intervalId;
function tryBlockingTwitterHome() {
  if (distractionsHidden(true)) {
      clearInterval(intervalId)
  } else {
      try {
          if (!hidden) {
            hideTwitterDistractions(true);
          }
      } catch (err) {
          console.log("Feed hasn't been loaded yet");
      }

  }
}

function blockFeedAndPanelTwitter() {
  if (homePageTwitterHasLoaded()) {
    hideTwitterDistractions(true)
  } else {
      if(initialLoad){
          intervalId = setInterval(tryBlockingTwitterHome, 1000)
          initialLoad =  false;
      }else{
          intervalId = setInterval(tryBlockingTwitterHome, 100)
      }
  }
}

function distractionsHidden(isHomePage) {
  if (isHomePage) {
      if (feedHasLoaded()) {
          return document.getElementsByClassName(TWITTER_PANEL_CLASS)[0].style.visibility == "hidden" && document.getElementsByClassName(TWITTER_FEED_CLASS)[1].style.visibility == "hidden";
      }
      return false;
  } else {
      if (panelHasLoaded()) {
          return document.getElementsByClassName(TWITTER_PANEL_CLASS)[0].style.visibility == "hidden"
      } 
      return false;
  }
}


function homePageTwitterHasLoaded() {
  return panelHasLoaded() && feedHasLoaded();
}




function panelHasLoaded() {
  return  document.getElementsByClassName(TWITTER_FEED_CLASS)[1]
}

function feedHasLoaded() {
  return document.getElementsByClassName(TWITTER_PANEL_CLASS)[0]
}




;(function () {
  // When the page loads, insert our browser extension code.
  var iFrame = createIframe() 
  iFrame.src = chrome.runtime.getURL('www/index.html')
  // document.body.prepend(iFrame)

  // document.getElementsByClassName("css-1dbjc4n r-1awozwy")[0].append(iFrame)
})()