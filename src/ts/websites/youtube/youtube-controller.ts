import YouTubeUtils from './youtube-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import { browser } from 'webextension-polyfill-ts';
import quoteUtils from '../../quotes';

export default class YouTubeController extends WebsiteController {
  
  YouTubeFeedChildNode: string | Node
  feedIntervalId: number
  suggestionsIntervalId: number
  suggestionElements: Node[]
  commentElements: Node[]
  panelElements: Node[]
  commentIntervalId: number
  quoteElement: HTMLDivElement | null
  isFeedBlocked: boolean
  hiddenFeedElements: HTMLElement[] = []

  constructor() {
    super()
    this.suggestionElements = []
    this.commentElements = []
    this.panelElements = []
    this.YouTubeFeedChildNode = ''

    this.feedIntervalId = 0
    this.suggestionsIntervalId = 0
    this.commentIntervalId = 0
    this.quoteElement = null
    this.isFeedBlocked = false

    this.addStorageListener();
  }

  addStorageListener() {
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        if (changes.showQuote) {
          this.handleShowQuoteChange(changes.showQuote.newValue);
        }
        if (changes.textSize) {
          this.handleTextSizeChange(changes.textSize.newValue);
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

  handleTextSizeChange(textSize: string) {
    if (this.quoteElement) {
      quoteUtils.updateQuoteTextSize(this.quoteElement, textSize);
    }
  }

  focus() {
    console.log('YouTubeController: Entering focus mode.');
    utils.clearElements(this.suggestionElements)
    utils.clearElements(this.commentElements)
    utils.clearElements(this.panelElements)
    this.focusFeed()
    this.focusSuggestions()
    this.focusComments()
    this.focusPanels()
  }

  unfocus() {
    console.log('YouTubeController: Exiting focus mode.');
    let url = document.URL
    if (YouTubeUtils.isHomePage(url)) {
      this.clearIntervals()
      this.setFeedVisibility(true)
      this.isFeedBlocked = false
    } else if (YouTubeUtils.isVideoPage(url)) {
      this.clearIntervals()
      this.setSuggestionsVisibility(true)
      this.setCommentsVisbility(true)
    }
  }

  clearIntervals() {
    this.clearAllIntervals()
  }

  focusSuggestions() {
    this.createInterval('suggestions', () => this.tryBlockingSuggestions())
  }

  focusFeed() {
    this.createInterval('feed', () => this.tryBlockingFeed())
  }

  focusComments() {
    this.createInterval('comments', () => this.tryBlockingComments())
  }

  focusPanels() {
    this.createInterval('panels', () => this.tryBlockingPanels())
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
      this.quoteElement = await quoteUtils.createSimpleQuoteElement();
      
      // Get YouTube's background color for proper theming
      const isDark = YouTubeUtils.isDarkTheme();
      const backgroundColor = isDark ? '#0f0f0f' : '#f9f9f9';
      
      this.quoteElement.style.background = backgroundColor;
      this.quoteElement.style.marginTop = '24px';

      const quoteText = this.quoteElement.querySelector('p:first-child') as HTMLElement;
      const quoteSource = this.quoteElement.querySelector('p:last-child') as HTMLElement;

      if (quoteText && quoteSource) {
        if (isDark) {
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

  setPanelsVisibility(visible: boolean) {
    let panels = YouTubeUtils.getPanels()
    if (panels) {
      if (!visible) {
        let length = panels.children.length
        let currentPanelElements = []
        while (length != 0) {
          var currentLastChild = panels.children[length - 1]
          currentPanelElements.push(currentLastChild)
          panels.removeChild(currentLastChild)
          length -= 1
        }
        this.panelElements = currentPanelElements
      } else {
        for (let i = this.panelElements.length - 1; i >= 0; i -= 1) {
          panels.append(this.panelElements[i])
        }
        utils.clearElements(this.panelElements)
      }
    }
  }

  async tryBlockingFeed() {
    if (this.isFeedBlocked) return
    
    this.tryBlocking(
      YouTubeUtils.isHomePage,
      YouTubeUtils.isFeedHidden,
      YouTubeUtils.hasFeedLoaded,
      () => this.setFeedVisibility(false)
    )
  }

  tryBlockingSuggestions() {
    this.tryBlocking(
      YouTubeUtils.isVideoPage,
      YouTubeUtils.areSuggestionsHidden,
      YouTubeUtils.haveSuggestionsLoaded,
      () => this.setSuggestionsVisibility(false)
    )
  }

  tryBlockingComments() {
    this.tryBlocking(
      YouTubeUtils.isVideoPage,
      YouTubeUtils.areCommentsHidden,
      YouTubeUtils.haveCommentsLoaded,
      () => this.setCommentsVisbility(false)
    )
  }

  tryBlockingPanels() {
    this.tryBlocking(
      YouTubeUtils.isVideoPage,
      YouTubeUtils.arePanelsHidden,
      YouTubeUtils.havePanelsLoaded,
      () => this.setPanelsVisibility(false)
    )
  }
}
