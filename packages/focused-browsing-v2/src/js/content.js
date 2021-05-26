var TWITTER_FEED_CLASS = "";
var TWITTER_PANEL_CLASS = "";

const FEED_CONTAINER_CLASS_NAME = "section[aria-labelledby^=accessible-list]"
const NEWS_FEED_CLASSNAME = "core-rail";
const SHARED_NEWS_CLASSNAME = "ad-banner-container artdeco-card ember-view";
const MAIN_CONTAINER_CLASSNAME = "neptune-grid three-column ghost-animate-in";
const LINKEDIN_NEWS = "news-module pv3 ember-view";

const VISIBILITY_HIDDEN = "hidden";
const VISIBILITY_VISIBLE = "visible";

const HOME_PAGE_CLASS = "self-focused ember-view";

var appIframe;
const DEFAULT_FRAME_HEIGHT = "100px";
const DEFAULT_FRAME_WIDTH = "120px";
const IFRAME_ID = "focus-card"
var firstURLConnection = window.location.toString()

var initialLoad = true
var port; 

var TWITTER_FEED_PARENT_NODE;
var TWITTER_FEED_CHILD_NODE; 
var TOPICS_TO_FOLLOW = null;

var PANEL_ELEMENTS;


function focusListener(msg) {
  console.log(msg)
  let status = msg.status
  let method = msg.method
  let url = msg.url
  if (status == "focus"){
     if (url.includes("twitter")) {
          PANEL_ELEMENTS =[]
          if(method == "initial"){
              focusTwitter();
          }else if(method == "hidePanels"){
              focusTwitterPanel();
          }else{
              toggleTwitterDistractions(true);
          }
          startIframe();
      } else if (url.includes("linkedin")){
          console.log("about to focus on linkedin");
          startIframe();
          hideLinkedIn(true);
      }
  }else if(msg.status == "unfocus"){
      if (url.includes("twitter")) {
          if(url.includes("/home")){
            console.log("about to un-focus on Twitter");
            toggleTwitterDistractions(false)
          }else{
            hideTwitterPanel(false)
          }
      } else if (url.includes("linkedin")) {
          console.log("about to un-focus on linkedin");
          hideLinkedIn(false);
      }
  }
}


;(function () {
    port = chrome.runtime.connect({name: "Focused Browsing"});
    console.log(firstURLConnection)
    port.postMessage({url: firstURLConnection});
    port.onMessage.addListener(focusListener)
    initIframe()
})()

function initIframe() {
    appIframe = document.createElement("iframe");
}

function startIframe() {
    appIframe.src = chrome.runtime.getURL("www/card.html");
}

function injectIframe() {
    appIframe.width = DEFAULT_FRAME_WIDTH;
    appIframe.height = DEFAULT_FRAME_HEIGHT;
    appIframe.id = IFRAME_ID

    Object.assign(appIframe.style, {
        position: "fixed",
        border: "none",
        zIndex: "10000",
    });
    
    TWITTER_FEED_PARENT_NODE.append(appIframe)
}

function removeIframe(){
  try{
    document.getElementById(IFRAME_ID).remove()
  }catch(err){
    console.log("the iframe is not on the screen")
  }
   
}


function hideLinkedIn(hide) {
    console.log("here in this linkedIn function")
    try {
      if (hide) {
        console.log("about to hide linkedIn feed")
        document.getElementsByClassName(
          HOME_PAGE_CLASS
        )[0].style.visibility = VISIBILITY_HIDDEN;
        injectIframe()
      } else {
        console.log("about to make linkedIn feed visible")
        document.getElementsByClassName(
          HOME_PAGE_CLASS
        )[0].style.visibility = VISIBILITY_VISIBLE;
        removeIframe()
      }
    } catch (err) {
      console.log(err);
    }
  }
  
function toggleTwitterDistractions(shouldHide) {
  console.log("here we are in toggle twitter distraction")
  console.log("should hide is: " + shouldHide)
  try {
    TWITTER_FEED_CLASS = getTwitterFeedClassName();
    if (shouldHide) {
      hideTwitterFeed(true)
      hideTwitterPanel(true)
      injectIframe();
    } else {
      hideTwitterFeed(false)
      hideTwitterPanel(false)
      removeIframe()
    }
  } catch (err) {
    console.log(err);
  }
}
  
var feedIntervalId;
function tryBlockingTwitterHome() {
  console.log("we are trying to block twitter home")
  if (distractionsHidden("home")) {
    console.log("we can clear the interval")
    console.log(feedIntervalId)
    clearInterval(feedIntervalId);
    initialLoad = false;
    return
  } else {
    console.log("distractions are not hidden")
    try {
      if (homePageTwitterHasLoaded()) {
          console.log("here in blocking twitter")
          toggleTwitterDistractions(true);
      }
    } catch (err) {
      console.log("Feed hasn't been loaded yet");
    }
  }
}

function tryBlockingTwitterPanel() {
  console.log("we are trying to block twitter panel")
  if (distractionsHidden("panel")) {
    console.log("we can clear the interval")
    console.log(pageInterval)
    clearInterval(pageInterval);
    return
  } else {
    try {
      if (hasTwitterPanelLoaded()) {
          console.log("here in blocking twitter panel")
          hideTwitterPanel(true);
      }
    } catch (err) {
      console.log("Panel hasn't been loaded yet");
    }
  }
}

function focusTwitter() {
  console.log("setting interval to block twitter")
  if (initialLoad) {
    feedIntervalId = setInterval(tryBlockingTwitterHome, 500);
    initialLoad = !initialLoad
  } else {
    feedIntervalId = setInterval(tryBlockingTwitterHome, 100);
  }
}


var pageInterval;
function focusTwitterPanel(){
  pageInterval = setInterval(tryBlockingTwitterPanel, 700);
}




function hideTwitterFeed(shouldhide){
  if(shouldhide){
    TWITTER_FEED_PARENT_NODE = document.getElementsByClassName(
      TWITTER_FEED_CLASS
    )[1]

    TWITTER_FEED_CHILD = document.getElementsByClassName(
      TWITTER_FEED_CLASS
    )[1].children[0]

    TWITTER_FEED_PARENT_NODE.removeChild(TWITTER_FEED_PARENT_NODE.childNodes[0])

  }else{
    TWITTER_FEED_PARENT_NODE.append(TWITTER_FEED_CHILD)
  }
}


function hideTwitterPanel(shouldHide){

  let PANEL = getTwitterPanel()
  if(shouldHide){
    let length = PANEL.children.length
    console.log("current length")
    console.log(length)
    // console.log(PANEL.children)
    while (length != 1) {
      var currentLastChild = PANEL.lastChild
      PANEL_ELEMENTS.push(currentLastChild)
      PANEL.removeChild(currentLastChild)
      length -= 1 
    }


  }else{
    // let i = 3
    // while(i >= 0){
    //   PANEL.append(PANEL_ELEMENTS[i])
    //   i-=1
    // }

    for(let i =0; i<PANEL_ELEMENTS.length; i+=1){
      PANEL.append(PANEL_ELEMENTS[i])
    }

  }
}






function distractionsHidden(isHomePage) {
  try{
    let PANEL = getTwitterPanel()
    if (isHomePage == "home") {
          let FEED = getTwitterFeed()
          return FEED.children[0].nodeName == "IFRAME" && PANEL.children.length == 1;
    } else {
          return PANEL.children.length == 1
    }
  }catch(err){
    console.log(err)
  }
}


  
function homePageTwitterHasLoaded() {
  return getTwitterPanel() && getTwitterFeed()
}


function getTwitterFeed(){
  return document.querySelectorAll('[role="main"]')[0].children[0].children[0]
  .children[0].children[0].children[0].children[3]

  
}

function getTwitterPanel(){
  return document.querySelectorAll('[role="main"]')[0].children[0].children[0]
  .children[0].children[1].children[0].children[1].children[0].children[0]
  .children[0]
}


function hasTwitterPanelLoaded(){
  let panel = getTwitterPanel()
  return panel.children.length == 5 || panel.children.length == 3
}


function getTwitterFeedClassName() {
  let feed = getTwitterFeed()
  if(feed != null){
    return feed.className
  }else{
    throw 'feed class name not found!';
  }
}

