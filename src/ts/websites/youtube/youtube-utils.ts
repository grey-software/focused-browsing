function getYouTubeFeed(): Element | null {
  let mainPage = document.querySelector('ytd-two-column-browse-results-renderer')
  if (mainPage) {
    return mainPage.children[0]
  }

  return null
}

function getYoutubeSuggestions(): Element | null {
  let suggestions_parent = document.querySelector('ytd-watch-next-secondary-results-renderer')
  if (suggestions_parent) {
    return suggestions_parent.children[1]
  }
  return null
}

function getYoutubeCommentsOnVideo(): Element | null {
  let comment_parent = document.querySelector('ytd-comments')
  if (comment_parent) {
    return comment_parent.children[1].children[2]
  }
  return null
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
    let youtubeComments = getYoutubeCommentsOnVideo()
    if (youtubeComments) {
      return youtubeComments.children.length != 0
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
  return url == 'https://www.youtube.com/'
}

function isVideoPage(url: string): boolean {
  if (url.includes('https://www.youtube.com/')) {
    return url.includes('/watch')
  }
  return false
}

export default {
  getYouTubeFeed,
  getYoutubeSuggestions,
  getYoutubeCommentsOnVideo,
  hasFeedLoaded,
  isFeedHidden,
  hasSuggestionsLoaded,
  areSuggestionsHidden,
  isHomePage,
  isVideoPage,
  hasCommentsLoaded,
  areCommentsHidden,
}
