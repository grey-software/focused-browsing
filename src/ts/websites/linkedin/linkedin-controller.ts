import LinkedInUtils from './linkedin-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import { browser } from 'webextension-polyfill-ts';
import quoteUtils from '../../quotes';

export default class LinkedInController extends WebsiteController {
  panelElements: Node[]
  feedIntervalId: number
  panelIntervalId: number
  feedChildNode: string | Node
  adChildNode: string | Node
  adIntervalId: number
  feedAdsIntervalId: number
  quoteElement: HTMLDivElement | null
  isFeedBlocked: boolean
  hiddenFeedElements: HTMLElement[] = []

  constructor() {
    super()
    this.panelElements = []
    this.feedChildNode = ''
    this.adChildNode = ''
    this.feedIntervalId = 0
    this.panelIntervalId = 0
    this.adIntervalId = 0
    this.feedAdsIntervalId = 0
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
        const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
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
    console.log('LinkedInController: Entering focus mode.');
    utils.clearElements(this.panelElements)
    this.focusFeed()
    this.focusPanel()
    this.focusAd()
  }

  unfocus() {
    console.log('LinkedInController: Exiting focus mode.');
    let url = document.URL
    if (LinkedInUtils.isHomePage(url)) {
      this.clearIntervals()
      utils.removeFocusedBrowsingCards()
      this.setFeedVisibility(true)
      this.setPanelVisibility(true)
      this.setAdVisibility(true)
      this.isFeedBlocked = false
    }
  }

  clearIntervals() {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.panelIntervalId)
    window.clearInterval(this.adIntervalId)
    window.clearInterval(this.feedAdsIntervalId)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryBlockingFeed()
    }, 250)
  }

  focusPanel() {
    if (this.panelIntervalId) {
      clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = window.setInterval(() => {
      this.tryBlockingPanel()
    }, 250)
  }

  focusAd() {
    if (this.adIntervalId) {
      clearInterval(this.adIntervalId)
    }
    this.adIntervalId = window.setInterval(() => {
      this.tryBlockingAd()
    }, 250)
  }

  focusFeedAds() {
    if (this.feedAdsIntervalId) {
      window.clearInterval(this.feedAdsIntervalId)
    }
    this.feedAdsIntervalId = window.setInterval(() => {
      this.hideFeedAds()
    }, 250)
  }

  setAdVisibility(visibile: boolean) {
    const adParentNode = LinkedInUtils.getAdHeader();
    if (!adParentNode || !visibile || !adParentNode.children.length) return;

    if (!visibile) {
      this.adChildNode = adParentNode.children[0];
      if (this.adChildNode) {
        adParentNode.removeChild(this.adChildNode);
      }
    } else if (this.adChildNode instanceof Node) {
      adParentNode.append(this.adChildNode);
    }
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
      feedParentNode.append(this.quoteElement!);
    }
  }

  async setFeedVisibility(visible: boolean) {
    const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
    if (!feedParentNode) return;

    if (!visible) {
      this.hideFeed(feedParentNode);
      await this.injectQuote(feedParentNode);
    }
    else {
      this.showFeed();
    }
  }

  setPanelVisibility(visible: boolean) {
    const panel = LinkedInUtils.getLinkedInPanel() as HTMLElement;
    if (!panel) return;

    if (!visible) {
      panel.style.display = 'none';
    } else {
      panel.style.display = '';
    }
  }

  tryBlockingAd() {
    let url = document.URL
    if (!LinkedInUtils.isHomePage(url)) {
      return
    }
    if (LinkedInUtils.isAdHidden()) {
      return
    }
    if (LinkedInUtils.hasAdLoaded()) {
      this.setAdVisibility(false)
      return
    }
  }

  async tryBlockingFeed() {
    if (this.isFeedBlocked) {
      return
    }
    let url = document.URL
    if (!LinkedInUtils.isHomePage(url)) {
      return
    }
    if (LinkedInUtils.isFeedHidden()) {
      return
    }
    if (LinkedInUtils.hasFeedLoaded()) {
      await this.setFeedVisibility(false)
      return
    }
  }

  tryBlockingPanel() {
    let url = document.URL
    if (!LinkedInUtils.isHomePage(url)) {
      return
    }

    if (LinkedInUtils.isPanelHidden()) {
      return
    }
    if (LinkedInUtils.hasPanelLoaded()) {
      this.setPanelVisibility(false)
      return
    }
  }

  hideFeedAds() {
    LinkedInUtils.getFeedAdElements().forEach((ad: HTMLElement) => {
      ad.style.display = 'none'
    })
  }
}
