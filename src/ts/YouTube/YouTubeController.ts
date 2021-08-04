import YouTubeUtils from './YouTubeUtils'
import YouTubeIFrameUtils from './YouTubeIFrameUtils'
import utils from '../utils'

export default class YouTubeController {
    YouTubeFeedChildNode: string | Node
    feedIntervalId: number
    suggestionsIntervalId: number
    feedIframe: HTMLIFrameElement
    suggestion_elements: Node[]
    constructor() {
        this.suggestion_elements = []
        this.YouTubeFeedChildNode = ''

        this.feedIntervalId = 0
        this.suggestionsIntervalId = 0
        this.feedIframe = YouTubeIFrameUtils.createYouTubeFeedIframe()
    }

    focus(url: string) {
        // the panel shows up on every page
        if (YouTubeUtils.isHomePage(url)) {
            this.focusFeed()
        } else if (YouTubeUtils.isVideoPage(url)) {
            this.focusSuggestions()
        }
    }

    unfocus(url: string) {
        utils.removeFocusedBrowsingCards()
        if (YouTubeUtils.isHomePage(url)) {
            this.setFeedVisibility(true)
            window.clearInterval(this.feedIntervalId)
        }

        if (YouTubeUtils.isVideoPage(url)) {
            this.setSuggestionsVisibility(true)
            window.clearInterval(this.suggestionsIntervalId)
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

    setFeedVisibility(visible: boolean) {
        let feed = YouTubeUtils.getYouTubeFeed()
        if (feed) {
            if (!visible) {
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
                for (let i = this.suggestion_elements.length - 1; i >= 0; i -= 1) {
                    suggestions.append(this.suggestion_elements[i])
                }
                utils.clearPanelElements(this.suggestion_elements)
            }
        }
    }

    tryBlockingFeed() {
        try {
            if (YouTubeUtils.isFeedHidden()) {
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
                this.setSuggestionsVisibility(false)
                return
            }
        } catch (err) { }
    }
}
