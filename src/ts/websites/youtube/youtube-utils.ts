import * as FocusUtils from '../../utils'

function getYouTubeFeed(doc: Document): Element | null {
  let mainPage = doc.querySelector('ytd-two-column-browse-results-renderer')
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

function haveSuggestionsLoaded(doc: Document): boolean {
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

function isHomePage(urlToCheck: string): boolean {
  let url = urlToCheck
  if (FocusUtils.isTestUrl(url)) {
    url = FocusUtils.fixTestUrl(url)
  }
  return url == 'https://www.youtube.com' || url == 'https://www.youtube.com/'
}

function isVideoPage(urlToCheck: string): boolean {
  let url = urlToCheck
  if (FocusUtils.isTestUrl(url)) {
    url = FocusUtils.fixTestUrl(url)
  }
  return url.includes('https://www.youtube.com/') && url.includes('/watch')
}

export default {
  getYouTubeFeed,
  getYoutubeSuggestions,
  getYoutubeCommentsOnVideo,
  hasFeedLoaded,
  isFeedHidden,
  haveSuggestionsLoaded,
  areSuggestionsHidden,
  isHomePage,
  isVideoPage,
  hasCommentsLoaded,
  areCommentsHidden,
}
