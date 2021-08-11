function getYouTubeFeed(): Element | null {
    return document.querySelector('#primary')
}

function getYoutubeSuggestions(): Element | null {
    return document.getElementById('secondary-inner')
}

function getYoutubeCommentsOnVideo(): Element | null {
    return document.getElementById('sections')
}


function hasFeedLoaded(): boolean {
    try {
        let youtubeFeed = getYouTubeFeed()
        if (youtubeFeed) {
            return youtubeFeed.children.length != 0
        }
    } catch (err) {
        return false
    }

    return false
}

function isFeedHidden(): boolean {
    let feed = getYouTubeFeed()
    if (feed) {
        return feed.children[0].nodeName == 'IFRAME'
    }
    return false
}


function hasSuggestionsLoaded(): boolean {
    try {
        let suggestions = getYoutubeSuggestions()
        if (suggestions) {
            return suggestions.children.length != 0
        }
        return false
    } catch (err) {
        return false
    }
}

function areSuggestionsHidden(): boolean {
    let suggestions = getYoutubeSuggestions()
    if (suggestions) {
        return suggestions.children.length == 1
    }
    return false
}


function hasCommentsLoaded(): boolean {
    try {
        let youtubeFeed = getYouTubeFeed()
        if (youtubeFeed) {
            return youtubeFeed.children.length != 0
        }
    } catch (err) {
        return false
    }

    return false
}

function areCommentsHidden(): boolean {
    let comments = getYoutubeCommentsOnVideo()
    if (comments) {
        return comments.children.length == 0
    }
    return false
}




function isHomePage(url: string): boolean {
    return url == "https://www.youtube.com/"
}

function isVideoPage(url: string): boolean {
    if (url.includes("https://www.youtube.com/")) {
        return url.includes("/watch")
    }
    return false
}

export default {
    getYouTubeFeed, getYoutubeSuggestions, getYoutubeCommentsOnVideo, hasFeedLoaded, isFeedHidden, hasSuggestionsLoaded, areSuggestionsHidden, isHomePage, isVideoPage, hasCommentsLoaded, areCommentsHidden
}





