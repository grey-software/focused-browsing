import YouTubeUtils from './youtube-utils'
import YouTubeIFrameUtils from './youtube-iframe-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'

export default class YouTubeController extends WebsiteController {
  YouTubeFeedChildNode: string | Node
  feedIntervalId: number
  suggestionsIntervalId: number
  feedIframe: HTMLIFrameElement
  suggestion_elements: Node[]
  comment_elements: Node[]
  commentIntervalId: number

  constructor() {
    super()
    this.suggestion_elements = []
    this.comment_elements = []
    this.YouTubeFeedChildNode = ''

    this.feedIntervalId = 0
    this.suggestionsIntervalId = 0
    this.commentIntervalId = 0
    this.feedIframe = YouTubeIFrameUtils.createYouTubeFeedIframe()

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      console.log('changed theme')
      let currentUrl = document.URL
      if (YouTubeUtils.isHomePage(currentUrl)) {
        let feed = YouTubeUtils.getYouTubeFeed()
        if (feed) {
          if (YouTubeUtils.isFeedHidden()) {
            utils.removeFocusedBrowsingCards()
            YouTubeIFrameUtils.injectFeedIframe(this.feedIframe, feed)
          }
        }
      }
    })
  }

  focus(url: string) {
    // the panel shows up on every page
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.suggestionsIntervalId)
    window.clearInterval(this.commentIntervalId)
    if (YouTubeUtils.isHomePage(url)) {
      console.log('i am here focusing page')
      this.focusFeed()
    } else if (YouTubeUtils.isVideoPage(url)) {
      this.focusSuggestions()
      this.focusComments()
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
    this.suggestionsIntervalId = window.setInterval(this.tryBlockingPanel.bind(this), 250)
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
    console.log('feed is')
    console.log(feed)
    if (feed) {
      if (!visible) {
        console.log('I am here now')
        this.YouTubeFeedChildNode = feed.children[0]
        feed.removeChild(feed.childNodes[0])
        YouTubeIFrameUtils.injectFeedIframe(this.feedIframe, feed)
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
        while (length != 1) {
          var currentLastChild = suggestions.children[length - 1]
          current_suggestion_elements.push(currentLastChild)
          suggestions.removeChild(currentLastChild)
          length -= 1
        }
        this.suggestion_elements = current_suggestion_elements
      } else {
        console.log('I am here in setting suggestions visibility to true')
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
        console.log('I am here in setting comments visibility to true')
        for (let i = this.comment_elements.length - 1; i >= 0; i -= 1) {
          comments.append(this.comment_elements[i])
        }
        utils.clearElements(this.comment_elements)
      }
    }
  }

  tryBlockingFeed() {
    try {
      if (YouTubeUtils.isFeedHidden()) {
        console.log('Feed is hidden')
        return
      }
      if (YouTubeUtils.hasFeedLoaded()) {
        this.setFeedVisibility(false)
        return
      }
    } catch (err) { }
  }

  tryBlockingPanel() {
    try {
      if (YouTubeUtils.areSuggestionsHidden()) {
        return
      }

      if (YouTubeUtils.hasSuggestionsLoaded()) {
        console.log('hiding suggestions')
        this.setSuggestionsVisibility(false)
        return
      }
    } catch (err) { }
  }

  tryBlockingComments() {
    try {
      if (YouTubeUtils.areCommentsHidden()) {
        return
      }

      if (YouTubeUtils.hasCommentsLoaded()) {
        console.log('hiding comments')
        this.setCommentsVisbility(false)
        return
      }
    } catch (err) { }
  }
}
