function getTwitterFeed() {
    return document.querySelectorAll('[role="main"]')[0].children[0].children[0]
        .children[0].children[0].children[0].children[3]
}

function getTwitterPanel() {
    return document.querySelectorAll('[role="main"]')[0].children[0].children[0]
        .children[0].children[1].children[0].children[1].children[0].children[0]
        .children[0]
}


function hasTwitterPanelLoaded() {
    let panel = getTwitterPanel()
    return panel.children.length == 5 || panel.children.length == 2
}


function getTwitterFeedClassName() {
    let feed = getTwitterFeed()
    if (feed != null) {
        return feed.className
    } else {
        throw 'feed class name not found!';
    }
}


function homePageTwitterHasLoaded() {
    return getTwitterPanel() && getTwitterFeed()
}

function sendLogToBackground(port, log){
    port.postMessage({event: "log", log: log})
}

module.exports = { homePageTwitterHasLoaded, getTwitterFeedClassName, hasTwitterPanelLoaded, getTwitterPanel, getTwitterFeed, sendLogToBackground}