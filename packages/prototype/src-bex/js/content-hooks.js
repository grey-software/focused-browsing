// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks
var TWITTER_FEED_CLASS = "";
var TWITTER_PANEL_CLASS = "";

const FEED_CONTAINER_CLASS_NAME = "section[aria-labelledby^=accessible-list]"
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
      //I am appending it to the body just to test it out for now, to see if the code is being rendered on focus right away 
      document.body.prepend(iFrame)
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
  setIFrameDimensions(defaultFrameHeight, defaultFrameWidth)
  Object.assign(iFrame.style, {
    position: 'fixed',
    border: 'none',
    zIndex: '10000'
  })

  iFrame.src = chrome.runtime.getURL('www/index.html')
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
      document.getElementsByClassName(TWITTER_FEED_CLASS)[0].style.visibility = "hidden"
      document.getElementsByClassName(TWITTER_PANEL_CLASS)[1].style.visibility = "hidden"

  
      hidden = true;
    }else{
      document.getElementsByClassName(TWITTER_FEED_CLASS)[0].style.visibility = "visible"
      document.getElementsByClassName(TWITTER_PANEL_CLASS)[1].style.visibility = "visible"
    }
  }catch(err){
    console.log(err)
  }
}


var intervalId;
function tryBlockingTwitterHome() {
  if (distractionsHidden()) {
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

function distractionsHidden() {
    if (feedHasLoaded()) {
      return isTwitterFeedHidden() && isTwitterPanelHidden()
    }

}


function homePageTwitterHasLoaded() {
  return panelHasLoaded() && feedHasLoaded();
}


function isTwitterFeedHidden(){
  return document.getElementsByClassName(TWITTER_FEED_CLASS)[0].style.visibility == "hidden"
}

function isTwitterPanelHidden(){
  return document.getElementsByClassName(TWITTER_PANEL_CLASS)[1].style.visibility == "hidden"
}

function panelHasLoaded() {
  TWITTER_FEED_CLASS = getTwitterPanelClassName()
  return TWITTER_FEED_CLASS
}

function feedHasLoaded() {
  TWITTER_PANEL_CLASS = getTwitterFeedClassName()
  return TWITTER_PANEL_CLASS
}



function getTwitterFeedClassName(){
  return document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[0].children[0].children[3].className
}

function getTwitterPanelClassName(){
  return document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[1].children[0].children[1].children[0].children[0].children[0].children[2].className
}



;(function () {
  // When the page loads, insert our browser extension code.
  createIframe()  
  // document.body.prepend(iFrame)
  // document.getElementsByClassName(TWITTER_FEED_CLASS)[1].append(iFrame)
})()