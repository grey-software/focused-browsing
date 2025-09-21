import YouTubeUtils from './youtube-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import { browser } from 'webextension-polyfill-ts';
import QuoteManager from '../../quote-manager';

export default class YouTubeController extends WebsiteController {
  
  YouTubeFeedChildNode: string | Node
  feedIntervalId: number
  suggestionsIntervalId: number
  cardChangeIntervalId: number
  suggestionElements: Node[]
  commentElements: Node[]
  commentIntervalId: number
  currentColor: string
  setCardColorIntervalId: number
  quoteElement: HTMLDivElement | null
  isFeedBlocked: boolean
  hiddenFeedElements: HTMLElement[] = []

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
    this.quoteElement = null
    this.isFeedBlocked = false

    this.currentColor = ''

    this.setCardColorInterval()
    this.listenForCardChange()
    this.addStorageListener();
  }

  addStorageListener() {
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        if (changes.showQuote) {
          this.handleShowQuoteChange(changes.showQuote.newValue);
        }
        if (changes.fontSize) {
          this.handleFontSizeChange(changes.fontSize.newValue);
        }
      }
    });
  }

  handleShowQuoteChange(showQuote: boolean) {
    if (showQuote) {
      if (this.isFeedBlocked && !this.quoteElement) {
        const feedParentNode = YouTubeUtils.getFeed() as HTMLElement;
        if (feedParentNode) {
          this.injectQuote(feedParentNode);
        }
      }
    } else {
      this.quoteElement?.remove();
      this.quoteElement = null;
    }
  }

  handleFontSizeChange(fontSize: number) {
    if (this.quoteElement) {
      const quoteText = this.quoteElement.querySelector('p:first-child') as HTMLElement;
      if (quoteText) {
        quoteText.style.fontSize = `${fontSize}px`;
      }
    }
  }

  listenForCardChange() {
    this.cardChangeIntervalId = window.setInterval(() => {
      this.changeCard()
    }, 250)
  }

  setCardColorInterval() {
    this.setCardColorIntervalId = window.setInterval(() => {
      if (this.currentColor != '') {
        return
      }
      document.body.style.background = 'var(--yt-spec-general-background-a)'
      this.currentColor = window.getComputedStyle(document.body).backgroundColor
    }, 250)
  }

  changeCard() {
    document.body.style.background = 'var(--yt-spec-general-background-a)'
    let backgroundColor = window.getComputedStyle(document.body).backgroundColor
    if (backgroundColor != this.currentColor && this.currentColor != '') {
      this.currentColor = backgroundColor
      if (this.quoteElement) {
        this.quoteElement.style.background = this.currentColor;
        const quoteText = this.quoteElement.querySelector('p:first-child') as HTMLElement;
        const quoteSource = this.quoteElement.querySelector('p:last-child') as HTMLElement;
        if (quoteText && quoteSource) {
          if (YouTubeUtils.isDarkTheme()) {
            quoteText.style.color = '#fff';
            quoteSource.style.color = '#ccc';
          } else {
            quoteText.style.color = '#000';
            quoteSource.style.color = '#666';
          }
        }
      }
    }
  }

  focus() {
    console.log('YouTubeController: Entering focus mode.');
    utils.clearElements(this.suggestionElements)
    utils.clearElements(this.commentElements)
    this.focusFeed()
    this.focusSuggestions()
    this.focusComments()
  }

  unfocus() {
    console.log('YouTubeController: Exiting focus mode.');
    let url = document.URL
    if (YouTubeUtils.isHomePage(url)) {
      this.clearIntervals()
      utils.removeFocusedBrowsingCards()
      this.setFeedVisibility(true)
      this.isFeedBlocked = false
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

  hideFeed(feedParentNode: HTMLElement) {
    this.isFeedBlocked = true;
    Array.from(feedParentNode.children).forEach((child) => {
      const htmlChild = child as HTMLElement;
      this.hiddenFeedElements.push(htmlChild);
      htmlChild.style.display = 'none';
    });
  }

  showFeed() {
    this.quoteElement?.remove();
    this.quoteElement = null;
    this.hiddenFeedElements.forEach((child) => {
      child.style.display = '';
    });
    this.hiddenFeedElements = [];
  }

  async injectQuote(feedParentNode: HTMLElement) {
    const settings = await browser.storage.local.get('showQuote');
    if (settings.showQuote === false) return;

    if (!this.quoteElement) {
      this.quoteElement = await QuoteManager.createSimpleQuoteElement();
      this.quoteElement.style.background = this.currentColor || '#f9f9f9';
      this.quoteElement.style.marginTop = '24px';

      const quoteText = this.quoteElement.querySelector('p:first-child') as HTMLElement;
      const quoteSource = this.quoteElement.querySelector('p:last-child') as HTMLElement;

      if (quoteText && quoteSource) {
        if (YouTubeUtils.isDarkTheme()) {
          quoteText.style.color = '#fff';
          quoteSource.style.color = '#ccc';
        } else {
          quoteText.style.color = '#000';
          quoteSource.style.color = '#666';
        }
      }

      feedParentNode.append(this.quoteElement!);
    }
  }

  async setFeedVisibility(visible: boolean) {
    const feedParentNode = YouTubeUtils.getFeed() as HTMLElement;
    if (!feedParentNode) return;

    if (!visible) {
      this.hideFeed(feedParentNode);
      await this.injectQuote(feedParentNode);
    } else {
      this.showFeed();
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

  async tryBlockingFeed() {
    if (this.isFeedBlocked) {
      return
    }
    let url = document.URL
    if (!YouTubeUtils.isHomePage(url)) {
      return
    }

    if (YouTubeUtils.isFeedHidden()) {
      return
    }
    if (YouTubeUtils.hasFeedLoaded()) {
      await this.setFeedVisibility(false)
      return
    }
  }

  tryBlockingSuggestions() {
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
  }

  tryBlockingComments() {
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
  }
}
