const LINKEDIN_FEED_CLASS = "scaffold-layout__main"
const PANEL_CLASS = "scaffold-layout__aside"
const AD_CLASS = "ad-banner-container is-header-zone"

function getLinkedInFeed(){
    return document.getElementsByClassName(LINKEDIN_FEED_CLASS)[0].children[2]
}
  
function getLinkedInPanel(){
    return document.getElementsByClassName(PANEL_CLASS)[0]
}

function getAdHeader(){
    return document.getElementsByClassName(AD_CLASS)[0]

}

function hasFeedLoaded(){
    return getLinkedInFeed().children.length == 2
}

function hasPanelLoaded(){
    return getLinkedInPanel().children.length == 3
} 

function hasAdLoaded(){
    return getAdHeader().children.length == 1
}

function isFeedHidden(){
    let feed = getLinkedInFeed()
    return feed.children[1].nodeName == "IFRAME"
}

function isPanelHidden(){
    let panel = getLinkedInPanel()
    return panel.children.length == 0;
}


function isAdHidden(){
    let ad = getAdHeader()
    return ad.children.length == 0;
}

function isHomePage(url){
    return url == "https://www.linkedin.com/feed/" || url == "https://www.linkedin.com/"
}


module.exports = {getLinkedInFeed, getLinkedInPanel, getAdHeader, isFeedHidden, isPanelHidden, isAdHidden, hasFeedLoaded, hasPanelLoaded, hasAdLoaded, isHomePage}