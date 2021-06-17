function getTwitterFeed() {
    return document.querySelectorAll('[role="main"]')[0].children[0].children[0]
        .children[0].children[0].children[0].children[3]
}

function getTwitterPanel() {
    return document.querySelectorAll('[role="main"]')[0].children[0].children[0]
        .children[0].children[1].children[0].children[1].children[0].children[0]
        .children[0]
}

function isFeedHidden() {
    let feed = getTwitterFeed()
    return feed.children[0].nodeName == "IFRAME"
}

function  isPanelHidden() {
    let panel = getTwitterPanel()
    return panel.children.length == 2;
}




module.exports = {getTwitterPanel, getTwitterFeed, isFeedHidden, isPanelHidden}