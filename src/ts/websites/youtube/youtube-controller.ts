import YouTubeUtils from './youtube-utils'
import YouTubeIFrameUtils from './youtube-iframe-utils'
import utils from '../../utils'
import WebsiteController from '../website-controller'

export default class YouTubeController extends WebsiteController {
  customFocus(): void {
    return
  }
  youTubeFeedChildNode: string | Node = ''
  feedIntervalId: number = 0
  suggestionsIntervalId: number = 0
  cardChangeIntervalId: number = 0
  commentIntervalId: number = 0
  setCardColorIntervalId: number = 0
  suggestionElements: Node[] = []
  commentElements: Node[] = []
  currentColor: string
  feedIframe: HTMLIFrameElement

  constructor() {
    super()
    this.suggestionElements = []
    this.commentElements = []
    this.feedIframe = YouTubeIFrameUtils.createYouTubeFeedIframe()

    this.currentColor = ''
    this.setCardColorInterval()
    this.listenForCardChange()
  }

  focus() {
    this.suggestionElements = []
    this.commentElements = []
    this.focusFeed()
    this.focusSuggestions()
    this.focusComments()
  }

  unfocus() {
    let url = document.URL
    if (YouTubeUtils.isHomePage(url)) {
      this.reset()
      utils.removeFocusedBrowsingCards()
      this.setFeedVisibility(true)
    } else if (YouTubeUtils.isVideoPage(url)) {
      this.reset()
      this.setSuggestionsVisibility(true)
      this.setCommentsVisbility(true)
    }
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
        let feed = YouTubeUtils.getYouTubeFeed()
        if (feed) {
          if (YouTubeUtils.isFeedHidden()) {
            utils.removeFocusedBrowsingCards()
            YouTubeIFrameUtils.injectFeedIframe(this.feedIframe, feed, this.currentColor)
          }
        }
      }
    }
  }

  reset() {
    window.clearInterval(this.suggestionsIntervalId)
    window.clearInterval(this.commentIntervalId)
    window.clearInterval(this.feedIntervalId)
  }

  focusSuggestions() {
    this.tryBlockingSuggestions()
    if (this.suggestionsIntervalId) {
      window.clearInterval(this.suggestionsIntervalId)
    }
    this.suggestionsIntervalId = window.setInterval(() => {
      this.tryBlockingSuggestions()
    }, 250)
  }

  focusFeed() {
    this.tryBlockingFeed()
    if (this.feedIntervalId) {
      window.clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryBlockingFeed()
    }, 250)
  }

  focusComments() {
    this.tryBlockingComments()
    if (this.commentIntervalId) {
      window.clearInterval(this.commentIntervalId)
    }
    this.commentIntervalId = window.setInterval(() => {
      this.tryBlockingComments()
    }, 250)
  }

  setFeedVisibility(visible: boolean) {
    let feed = YouTubeUtils.getYouTubeFeed()
    if (feed) {
      if (!visible) {
        this.youTubeFeedChildNode = feed.children[0]
        feed.removeChild(feed.childNodes[0])
        YouTubeIFrameUtils.injectFeedIframe(this.feedIframe, feed, this.currentColor)
      } else {
        feed.append(this.youTubeFeedChildNode)
      }
    }
  }

  setSuggestionsVisibility(visibile: boolean) {
    let suggestions = YouTubeUtils.getYoutubeSuggestions()
    if (suggestions) {
      if (!visibile) {
        let length = suggestions.children.length
        let current_suggestion_elements = []
        while (length != 0) {
          var currentLastChild = suggestions.children[length - 1]
          current_suggestion_elements.push(currentLastChild)
          suggestions.removeChild(currentLastChild)
          length -= 1
        }
        this.suggestionElements = current_suggestion_elements
      } else {
        for (let i = this.suggestionElements.length - 1; i >= 0; i -= 1) {
          suggestions.append(this.suggestionElements[i])
        }
        this.suggestionElements = []
      }
    }
  }

  setCommentsVisbility(visibile: boolean) {
    let comments = YouTubeUtils.getYoutubeCommentsOnVideo()
    if (comments) {
      if (!visibile) {
        let length = comments.children.length
        let current_comment_elements = []
        while (length != 0) {
          var currentLastChild = comments.children[length - 1]
          current_comment_elements.push(currentLastChild)
          comments.removeChild(currentLastChild)
          length -= 1
        }
        this.commentElements = current_comment_elements
      } else {
        for (let i = this.commentElements.length - 1; i >= 0; i -= 1) {
          comments.append(this.commentElements[i])
        }
        this.commentElements = []
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

      if (YouTubeUtils.hasSuggestionsLoaded()) {
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

      if (YouTubeUtils.hasCommentsLoaded()) {
        this.setCommentsVisbility(false)
        return
      }
    } catch (err) {}
  }
}
