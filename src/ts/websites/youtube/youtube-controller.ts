import YouTubeUtils from './youtube-utils'
// import YouTubeIFrameUtils from './youtube-iframe-utils'
import * as FocusUtils from '../../utils'
import WebsiteController from '../website-controller'

const ytCardHeight = '100%'
const ytCardWidth = '100%'
const ytCardStyles = {
  position: 'fixed',
  border: 'none',
}

export default class YouTubeController extends WebsiteController {
  customFocus(): void {
    throw new Error('Method not implemented.')
  }
  doc: Document
  mainFeedChild: string | Node
  feedIntervalId: number
  suggestionsIntervalId: number
  cardChangeIntervalId: number
  feedIframe: HTMLIFrameElement
  suggestionElements: Node[]
  commentElements: Node[]
  commentIntervalId: number
  currentColor: string
  setCardColorIntervalId: number

  constructor(doc: Document) {
    super()
    this.doc = doc
    this.suggestionElements = []
    this.commentElements = []
    this.mainFeedChild = ''

    this.feedIntervalId = 0
    this.suggestionsIntervalId = 0
    this.commentIntervalId = 0
    this.cardChangeIntervalId = 0
    this.setCardColorIntervalId = 0
    this.feedIframe = FocusUtils.createFocusCardIframe(ytCardWidth, ytCardHeight, ytCardStyles)

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
        this.doc.body.style.background = 'var(--yt-spec-general-background-a)'
        this.currentColor = window.getComputedStyle(this.doc.body).backgroundColor
      } catch (err) {}
    }, 250)
  }

  changeCard() {
    let currentUrl = this.doc.URL
    if (!YouTubeUtils.isHomePage(currentUrl)) {
      return
    }
    this.doc.body.style.background = 'var(--yt-spec-general-background-a)'
    let backgroundColor = window.getComputedStyle(this.doc.body).backgroundColor
    if (backgroundColor != this.currentColor && this.currentColor != '') {
      this.currentColor = backgroundColor

      let feed = YouTubeUtils.getYouTubeFeed(this.doc)
      if (feed) {
        if (YouTubeUtils.isFeedHidden(this.doc)) {
          FocusUtils.removeFocusedBrowsingCards()
          // this.setCardIframe(feed, )
        }
      }
    }
  }

  setCardIframe(ytFeed: Element, iframeSourceUrl: string) {
    this.feedIframe.src = iframeSourceUrl
    ytFeed.append(this.feedIframe)
  }

  unfocus() {
    let url = FocusUtils.fixTestUrl(this.doc.URL)
    if (YouTubeUtils.isHomePage(url)) {
      this.clearIntervals()
      FocusUtils.removeFocusedBrowsingCards()
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

  setFeedVisibility(hideFeed: boolean) {
    let feed = YouTubeUtils.getYouTubeFeed(this.doc)
    if (!feed) {
      return
    }
    if (hideFeed) {
      this.mainFeedChild = feed.children[0]
      feed.removeChild(feed.childNodes[0])
      // YouTubeIFrameUtils.setIframeSource(this.feedIframe, this.currentColor)
      feed.append(this.feedIframe)
    } else {
      feed.append(this.mainFeedChild)
    }
  }

  setSuggestionsVisibility(visibile: boolean) {
    let suggestions = YouTubeUtils.getYoutubeSuggestions(this.doc)
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
        this.suggestionElements = []
      }
    }
  }

  setCommentsVisbility(hideComments: boolean) {
    let comments = YouTubeUtils.getVideoComments(this.doc)
    if (!comments) {
      return
    }
    if (hideComments) {
      let length = comments.children.length
      let currentCommentElements = []
      while (length != 0) {
        const currentLastChild = comments.children[length - 1]
        currentCommentElements.push(currentLastChild)
        comments.removeChild(currentLastChild)
        length -= 1
      }
      this.commentElements = currentCommentElements
    } else {
      for (let i = this.commentElements.length - 1; i >= 0; i -= 1) {
        comments.append(this.commentElements[i])
      }
      this.commentElements = []
    }
  }

  tryBlockingFeed() {
    try {
      let url = FocusUtils.fixTestUrl(this.doc.URL)
      if (!YouTubeUtils.isHomePage(url)) {
        return
      }
      if (YouTubeUtils.isFeedHidden(this.doc)) {
        return
      }
      if (YouTubeUtils.hasFeedLoaded(this.doc)) {
        this.setFeedVisibility(false)
        return
      }
    } catch (err) {
      console.log(err)
    }
  }

  tryBlockingSuggestions() {
    try {
      let url = FocusUtils.fixTestUrl(this.doc.URL)
      if (!YouTubeUtils.isVideoPage(url)) {
        return
      }
      if (YouTubeUtils.areSuggestionsHidden(this.doc)) {
        return
      }

      if (YouTubeUtils.haveSuggestionsLoaded(this.doc)) {
        this.setSuggestionsVisibility(false)
        return
      }
    } catch (err) {}
  }

  tryBlockingComments() {
    try {
      let url = FocusUtils.fixTestUrl(this.doc.URL)
      if (!YouTubeUtils.isVideoPage(url)) {
        return
      }

      if (YouTubeUtils.areCommentsHidden(this.doc)) {
        return
      }

      if (YouTubeUtils.hasCommentsLoaded(this.doc)) {
        this.setCommentsVisbility(false)
        return
      }
    } catch (err) {}
  }
}
