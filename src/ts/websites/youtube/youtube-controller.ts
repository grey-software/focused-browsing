import YouTubeUtils from './youtube-utils'
import YouTubeIFrameUtils from './youtube-iframe-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'

export default class YouTubeController extends WebsiteController {
  premiumFocus(): void {
    throw new Error('Method not implemented.')
  }
  YouTubeFeedChildNode: string | Node
  feedIntervalId: number
  suggestionsIntervalId: number
  cardChangeIntervalId: number
  feedIframe: HTMLIFrameElement
  suggestionElements: Node[]
  commentElements: Node[]
  commentIntervalId: number
  currentColor: string
  setCardColorIntervalId: number

  constructor() {
    super()
    this.suggestionElements = []
    this.commentElements = []
    this.YouTubeFeedChildNode = ''

    this.feedIntervalId = 0
    this.suggestionsIntervalId = 0
    this.commentIntervalId = 0
    this.cardChangeIntervalId = 0
    this.setCardColorIntervalId = 0
    this.feedIframe = YouTubeIFrameUtils.createYouTubeFeedIframe()

    this.currentColor = ''

    this.setCardColorInterval()
    this.listenForCardChange()
  }

  focus() {
    utils.clearElements(this.suggestionElements)
    utils.clearElements(this.commentElements)
    this.focusFeed()
    this.focusSuggestions()
    this.focusComments()
  }

  listenForCardChange() {
    this.cardChangeIntervalId = window.setInterval(() => {
      this.changeCard()
    }, 250)
  }

  setCardColorInterval() {
    this.setCardColorIntervalId = window.setInterval(() => {
      try {
        if (this.currentColor != '') {
          return
        }
        document.body.style.background = 'var(--yt-spec-general-background-a)'
        this.currentColor = window.getComputedStyle(document.body).backgroundColor
      } catch (err) {}
    }, 250)
  }

  changeCard() {
    document.body.style.background = 'var(--yt-spec-general-background-a)'
    let backgroundColor = window.getComputedStyle(document.body).backgroundColor
    if (backgroundColor != this.currentColor && this.currentColor != '') {
      this.currentColor = backgroundColor
      let currentUrl = document.URL
      if (YouTubeUtils.isHomePage(currentUrl)) {
        let feed = YouTubeUtils.getFeed()
        if (feed) {
          if (YouTubeUtils.isFeedHidden()) {
            utils.removeFocusedBrowsingCards()
            YouTubeIFrameUtils.injectFeedIframe(this.feedIframe, feed, this.currentColor)
          }
        }
      }
    }
  }

  unfocus() {
    let url = document.URL
    if (YouTubeUtils.isHomePage(url)) {
      this.clearIntervals()
      utils.removeFocusedBrowsingCards()
      this.setFeedVisibility(true)
    } else if (YouTubeUtils.isVideoPage(url)) {
      this.clearIntervals()
      this.setSuggestionsVisibility(true)
      this.setCommentsVisbility(true)
    }
  }

  clearIntervals() {
    window.clearInterval(this.suggestionsIntervalId)
    window.clearInterval(this.commentIntervalId)
    window.clearInterval(this.feedIntervalId)
  }

  focusSuggestions() {
    if (this.suggestionsIntervalId) {
      window.clearInterval(this.suggestionsIntervalId)
    }
    this.suggestionsIntervalId = window.setInterval(() => {
      this.tryBlockingSuggestions()
    }, 250)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      window.clearInterval(this.feedIntervalId)
    }

    this.feedIntervalId = window.setInterval(() => {
      this.tryBlockingFeed()
    }, 250)
  }

  focusComments() {
    if (this.commentIntervalId) {
      window.clearInterval(this.commentIntervalId)
    }
    this.commentIntervalId = window.setInterval(() => {
      this.tryBlockingComments()
    }, 250)
  }

  setFeedVisibility(visible: boolean) {
    let feed = YouTubeUtils.getFeed()
    if (feed) {
      if (!visible) {
        this.YouTubeFeedChildNode = feed.children[0]
        feed.removeChild(feed.childNodes[0])
        YouTubeIFrameUtils.injectFeedIframe(this.feedIframe, feed, this.currentColor)
      } else {
        feed.append(this.YouTubeFeedChildNode)
      }
    }
  }

  setSuggestionsVisibility(visibile: boolean) {
    let suggestions = YouTubeUtils.getSuggestions()
    if (suggestions) {
      if (!visibile) {
        let length = suggestions.children.length
        let currentSuggestionElements = []
        while (length != 0) {
          var currentLastChild = suggestions.children[length - 1]
          currentSuggestionElements.push(currentLastChild)
          suggestions.removeChild(currentLastChild)
          length -= 1
        }
        this.suggestionElements = currentSuggestionElements
      } else {
        for (let i = this.suggestionElements.length - 1; i >= 0; i -= 1) {
          suggestions.append(this.suggestionElements[i])
        }
        utils.clearElements(this.suggestionElements)
      }
    }
  }

  setCommentsVisbility(visibile: boolean) {
    let comments = YouTubeUtils.getVideoComments()
    if (comments) {
      if (!visibile) {
        let length = comments.children.length
        let currentCommentElements = []
        while (length != 0) {
          var currentLastChild = comments.children[length - 1]
          currentCommentElements.push(currentLastChild)
          comments.removeChild(currentLastChild)
          length -= 1
        }
        this.commentElements = currentCommentElements
      } else {
        for (let i = this.commentElements.length - 1; i >= 0; i -= 1) {
          comments.append(this.commentElements[i])
        }
        utils.clearElements(this.commentElements)
      }
    }
  }

  tryBlockingFeed() {
    try {
      let url = document.URL
      if (!YouTubeUtils.isHomePage(url)) {
        return
      }

      if (YouTubeUtils.isFeedHidden()) {
        return
      }
      if (YouTubeUtils.hasFeedLoaded()) {
        this.setFeedVisibility(false)
        return
      }
    } catch (err) {}
  }

  tryBlockingSuggestions() {
    try {
      let url = document.URL
      if (!YouTubeUtils.isVideoPage(url)) {
        return
      }
      if (YouTubeUtils.areSuggestionsHidden()) {
        return
      }

      if (YouTubeUtils.haveSuggestionsLoaded()) {
        this.setSuggestionsVisibility(false)
        return
      }
    } catch (err) {}
  }

  tryBlockingComments() {
    try {
      let url = document.URL
      if (!YouTubeUtils.isVideoPage(url)) {
        return
      }

      if (YouTubeUtils.areCommentsHidden()) {
        return
      }

      if (YouTubeUtils.haveCommentsLoaded()) {
        this.setCommentsVisbility(false)
        return
      }
    } catch (err) {}
  }
}
