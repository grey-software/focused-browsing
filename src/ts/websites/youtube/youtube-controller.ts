import YouTubeUtils from './youtube-utils'
import YouTubeIFrameUtils from './youtube-iframe-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'

export default class YouTubeController extends WebsiteController {
  YouTubeFeedChildNode: string | Node
  feedIntervalId: number
  suggestionsIntervalId: number
  cardChangeIntervalId: number
  feedIframe: HTMLIFrameElement
  suggestion_elements: Node[]
  comment_elements: Node[]
  commentIntervalId: number
  currentColor: string
  setCardColorIntervalId: number

  constructor() {
    super()
    this.suggestion_elements = []
    this.comment_elements = []
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

    // setTimeout(() => {
    //   this.setCardColorIntervalId()
    //   this.listenForCardChange()
    // }, 500)
  }

  focus(url: string) {
    this.focusFeed()
    this.focusSuggestions()
    this.focusComments()
  }

  listenForCardChange() {
    this.cardChangeIntervalId = window.setInterval(this.changeCard.bind(this), 250)
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

  unfocus(url: string) {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.suggestionsIntervalId)
    window.clearInterval(this.commentIntervalId)
    if (YouTubeUtils.isHomePage(url)) {
      utils.removeFocusedBrowsingCards()
      this.setFeedVisibility(true)
    } else if (YouTubeUtils.isVideoPage(url)) {
      this.setSuggestionsVisibility(true)
      this.setCommentsVisbility(true)
    }
  }

  focusSuggestions() {
    if (this.suggestionsIntervalId) {
      window.clearInterval(this.suggestionsIntervalId)
    }
    this.suggestionsIntervalId = window.setInterval(this.tryBlockingSuggestions.bind(this), 250)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      window.clearInterval(this.feedIntervalId)
    }

    this.feedIntervalId = window.setInterval(this.tryBlockingFeed.bind(this), 250)
  }

  focusComments() {
    if (this.commentIntervalId) {
      window.clearInterval(this.commentIntervalId)
    }
    this.commentIntervalId = window.setInterval(this.tryBlockingComments.bind(this), 250)
  }

  setFeedVisibility(visible: boolean) {
    let feed = YouTubeUtils.getYouTubeFeed()
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
        this.suggestion_elements = current_suggestion_elements
      } else {
        for (let i = this.suggestion_elements.length - 1; i >= 0; i -= 1) {
          suggestions.append(this.suggestion_elements[i])
        }
        utils.clearElements(this.suggestion_elements)
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
        this.comment_elements = current_comment_elements
      } else {
        for (let i = this.comment_elements.length - 1; i >= 0; i -= 1) {
          comments.append(this.comment_elements[i])
        }
        utils.clearElements(this.comment_elements)
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
