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
      this.setFeedVisibility(true)
      this.setPanelVisibility(true)
      this.setAdVisibility(true)
      this.isFeedBlocked = false
    }
  }

  clearIntervals() {
    this.clearAllIntervals()
  }

  focusFeed() {
    this.createInterval('feed', () => this.tryBlockingFeed())
  }

  focusPanel() {
    this.createInterval('panel', () => this.tryBlockingPanel())
  }

  focusAd() {
    this.createInterval('ad', () => this.tryBlockingAd())
  }

  focusFeedAds() {
    this.createInterval('feedAds', () => this.hideFeedAds())
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
    this.tryBlocking(
      LinkedInUtils.isHomePage,
      LinkedInUtils.isAdHidden,
      LinkedInUtils.hasAdLoaded,
      () => this.setAdVisibility(false)
    )
  }

  async tryBlockingFeed() {
    if (this.isFeedBlocked) return
    
    this.tryBlocking(
      LinkedInUtils.isHomePage,
      LinkedInUtils.isFeedHidden,
      LinkedInUtils.hasFeedLoaded,
      () => this.setFeedVisibility(false)
    )
  }

  tryBlockingPanel() {
    this.tryBlocking(
      LinkedInUtils.isHomePage,
      LinkedInUtils.isPanelHidden,
      LinkedInUtils.hasPanelLoaded,
      () => this.setPanelVisibility(false)
    )
  }

  hideFeedAds() {
    LinkedInUtils.getFeedAdElements().forEach((ad: HTMLElement) => {
      ad.style.display = 'none'
    })
  }
}
