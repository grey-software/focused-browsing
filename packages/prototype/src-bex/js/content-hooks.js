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
console.log(currentUrl)

export default function attachContentHooks (bridge) {
  // handle event
  bridge.on('focus', function (event) {
    if (currentUrl == "https://twitter.com/home"){
      console.log("about to enter focus on Twitter")
      hideTwitter(true)
    }
    else if(currentUrl == "https://www.linkedin.com/feed/"){
      console.log("about to focus on linkedin")
      hideLinkedIn(true)
    }
  })

  bridge.on('un-focus', function (event) { 
    if (currentUrl == "https://twitter.com/home"){
      console.log("about to un-focus on Twitter")
      hideTwitter(false)
    }
    else if(currentUrl == "https://www.linkedin.com/feed/"){
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
  if(hide){
    // const newsFeedContainer = document.getElementsByClassName(NEWS_FEED_CLASSNAME)[0]
    // document.getElementsByClassName(SHARED_NEWS_CLASSNAME)[0].style.visibility = 'hidden'
    // for (let i = 0; i < newsFeedContainer.children.length; i++) {
    //     newsFeedContainer.children[i].style.visibility = 'hidden';
    // }
    // document.getElementsByClassName('ad-banner-container is-header-zone ember-view')[0].style.visibility = 'hidden'
    // document.getElementsByClassName(LINKEDIN_NEWS)[0].style.visibility = 'hidden'
    // displayQuote()
    // setTimeout(() => {
    //     document.getElementsByClassName(MAIN_CONTAINER_CLASSNAME)[0].style.opacity = "1"
    // }, 148)
    document.getElementsByClassName(HOME_PAGE_CLASS)[0].style.visibility = "hidden"
  }else{
    // document.getElementsByClassName(SHARED_NEWS_CLASSNAME)[0].style.visibility = 'visible'
    // document.getElementsByClassName(NEWS_FEED_CLASSNAME)[0].children[0].remove()
    // for (let i = 0; i < newsFeedContainer.children.length; i++) {
    //     newsFeedContainer.children[i].style.visibility = 'visible';
    // }
    // document.getElementsByClassName('ad-banner-container is-header-zone ember-view')[0].style.visibility = 'visible'
    // document.getElementsByClassName(LINKEDIN_NEWS)[0].style.visibility = 'visible'
    document.getElementsByClassName(HOME_PAGE_CLASS)[0].style.visibility = "visible"
  }
}


function hideTwitter(hide){
  if(hide){
    document.getElementsByClassName(TWITTER_FEED_CLASS)[1].style.visibility = "hidden"
    document.getElementsByClassName(TWITTER_PANEL_CLASS)[0].style.visibility = "hidden"
  }else{
    document.getElementsByClassName(TWITTER_FEED_CLASS)[1].style.visibility = "visible"
    document.getElementsByClassName(TWITTER_PANEL_CLASS)[0].style.visibility = "visible"
  }
}

;(function () {
  // When the page loads, insert our browser extension code.
  var iFrame = createIframe() 
  iFrame.src = chrome.runtime.getURL('www/index.html')
  // document.body.prepend(iFrame)

  // document.getElementsByClassName("css-1dbjc4n r-1awozwy")[0].append(iFrame)
})()