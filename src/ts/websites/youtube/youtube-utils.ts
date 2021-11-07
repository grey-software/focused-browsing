function getFeed(): Element | null {
  let mainPage = document.querySelector('ytd-two-column-browse-results-renderer')
  if (mainPage) {
    return mainPage.children[0]
  }

  return null
}

function getSuggestions(): Element | null {
  let suggestionsParent = document.querySelector('ytd-watch-next-secondary-results-renderer')
  if (suggestionsParent) {
    return suggestionsParent.children[1]
  }
  return null
}

function getVideoComments(): Element | null {
  let commentParent = document.querySelector('ytd-comments')
  if (commentParent) {
    return commentParent.children[1].children[2]
  }
  return null
}

function hasFeedLoaded(): boolean {
  try {
    let youtubeFeed = getFeed()
    if (youtubeFeed) {
      return youtubeFeed.children.length != 0
    }
  } catch (err) {
    return false
  }
  return false
}

function isFeedHidden(): boolean {
  let feed = getFeed()
  if (feed) {
    return feed.children[0].nodeName == 'IFRAME'
  }
  return false
}

function haveSuggestionsLoaded(): boolean {
  try {
    let suggestions = getSuggestions()
    if (suggestions) {
      return suggestions.children.length != 0
    }
    return false
  } catch (err) {
    return false
  }
}

function areSuggestionsHidden(): boolean {
  let suggestions = getSuggestions()
  if (suggestions) {
    return suggestions.children.length == 1
  }
  return false
}

function haveCommentsLoaded(): boolean {
  try {
    let youtubeComments = getVideoComments()
    if (youtubeComments) {
      return youtubeComments.children.length != 0
    }
  } catch (err) {
    return false
  }

  return false
}

function areCommentsHidden(): boolean {
  let comments = getVideoComments()
  if (comments) {
    return comments.children.length == 0
  }
  return false
}

function isHomePage(url: string): boolean {
  return url == 'https://www.youtube.com/'
}

function isVideoPage(url: string): boolean {
  if (url.includes('https://www.youtube.com/')) {
    return url.includes('/watch')
  }
  return false
}

export default {
  getFeed,
  getSuggestions,
  getVideoComments,
  hasFeedLoaded,
  isFeedHidden,
  haveSuggestionsLoaded,
  areSuggestionsHidden,
  isHomePage,
  isVideoPage,
  haveCommentsLoaded,
  areCommentsHidden,
}
