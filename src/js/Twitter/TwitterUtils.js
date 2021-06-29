function getTwitterFeed() {
    return document.querySelectorAll('[role="main"]')[0].children[0].children[0]
        .children[0].children[0].children[0].children[3]
}

function getTwitterPanel() {
    return document.querySelectorAll('[role="main"]')[0].children[0].children[0]
        .children[0].children[1].children[0].children[1].children[0].children[0]
        .children[0]
}


function hasFeedLoaded(){
    return getTwitterFeed().children.length == 1
}

function hasPanelLoaded(){
    return getTwitterPanel().children.length == 5
}

function isFeedHidden() {
    let feed = getTwitterFeed()
    return feed.children[0].nodeName == "IFRAME"
}

function  isPanelHidden() {
    let panel = getTwitterPanel()
    return panel.children.length == 2;
}

function isHomePage(url){
    return url == "https://twitter.com/home" || url == "https://twitter.com/"
}




module.exports = {getTwitterPanel, getTwitterFeed, isFeedHidden, isPanelHidden, hasFeedLoaded, hasPanelLoaded, isHomePage}