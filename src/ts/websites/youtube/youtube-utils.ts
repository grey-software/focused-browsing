function getYouTubeFeed(doc: Document): Element | null {
  let mainPage = doc.querySelector('ytd-two-column-browse-results-renderer')
  console.log(mainPage)

  if (mainPage) {
    return mainPage.children[0]
  }

  return null
}

function getYoutubeSuggestions(doc: Document): Element | null {
  let suggestions_parent = doc.querySelector('ytd-watch-next-secondary-results-renderer')
  if (suggestions_parent) {
    return suggestions_parent.children[1]
  }
  return null
}

function getYoutubeCommentsOnVideo(doc: Document): Element | null {
  let comment_parent = doc.querySelector('ytd-comments')
  if (comment_parent) {
    return comment_parent.children[1].children[2]
  }
  return null
}

function hasFeedLoaded(doc: Document): boolean {
  try {
    let youtubeFeed = getYouTubeFeed(doc)

    if (youtubeFeed) {
      return youtubeFeed.children.length != 0
    }
  } catch (err) {
    return false
  }

  return false
}

function isFeedHidden(doc: Document): boolean {
  let feed = getYouTubeFeed(doc)
  if (feed) {
    return feed.children[0].nodeName == 'IFRAME'
  }
  return false
}

function hasSuggestionsLoaded(doc: Document): boolean {
  try {
    let suggestions = getYoutubeSuggestions(doc)
    if (suggestions) {
      return suggestions.children.length != 0
    }
    return false
  } catch (err) {
    return false
  }
}

function areSuggestionsHidden(doc: Document): boolean {
  let suggestions = getYoutubeSuggestions(doc)
  if (suggestions) {
    return suggestions.children.length == 1
  }
  return false
}

function hasCommentsLoaded(doc: Document): boolean {
  try {
    let youtubeComments = getYoutubeCommentsOnVideo(doc)
    if (youtubeComments) {
      return youtubeComments.children.length != 0
    }
  } catch (err) {
    return false
  }

  return false
}

function areCommentsHidden(doc: Document): boolean {
  let comments = getYoutubeCommentsOnVideo(doc)
  if (comments) {
    return comments.children.length == 0
  }
  return false
}

function isHomePage(url: string): boolean {
  console.log(url)
  console.log(url == 'https://www.youtube.com' || url == 'https://www.youtube.com/')

  return url == 'https://www.youtube.com' || url == 'https://www.youtube.com/'
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
