import YouTubeUtils from './youtube-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import { browser } from 'webextension-polyfill-ts';
import quoteUtils from '../../quotes';

export default class YouTubeController extends WebsiteController {
  
  YouTubeFeedChildNode: string | Node = '';
  suggestionElements: Node[] = [];
  commentElements: Node[] = [];
  panelElements: Node[] = [];  // Now for miniplayer/panels
  hiddenFeedElements: HTMLElement[] = [];
  commentIntervalId: number = 0;  // Legacy, can remove if not used elsewhere
  quoteElement: HTMLDivElement | null = null;
  isFeedBlocked: boolean = false;

  // Observers array for cleanup
  private observers: MutationObserver[] = [];
  private debounceTimers: NodeJS.Timeout[] = [];

  constructor() {
    super()
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

  // Elegant Observer Creation (Core Strategy)
  private createObserver(
    targetSelector: string,
    pageCheck: (url: string) => boolean,
    loadCheck: () => boolean,
    hiddenCheck: () => boolean,
    blockAction: () => void,
    config: MutationObserverInit = { childList: true, subtree: true }
  ) {
    if (!pageCheck(document.URL)) return;  // Skip if wrong page

    const target = document.querySelector(targetSelector) || document.body;
    const observer = new MutationObserver((mutations) => {
      // Debounce: Ignore if recent mutation (e.g., 100ms)
      if (this.debounceTimers[0]) clearTimeout(this.debounceTimers[0]);
      this.debounceTimers[0] = setTimeout(() => {
        if (loadCheck() && !hiddenCheck()) {
          blockAction();
        }
      }, 100);
    });

    observer.observe(target, config);
    this.observers.push(observer);

    // Initial scan (elegant one-off check)
    setTimeout(() => {
      if (loadCheck() && !hiddenCheck()) blockAction();
    }, 500);  // Delay for initial load
  }

  focus() {
    console.log('YouTubeController: Entering focus mode.');
    utils.clearElements(this.suggestionElements);
    utils.clearElements(this.commentElements);
    utils.clearElements(this.panelElements);
    this.focusFeed();
    this.focusSuggestions();
    this.focusComments();
    this.focusPanels();
  }

  unfocus() {
    console.log('YouTubeController: Exiting focus mode.');
    const url = document.URL;
    if (YouTubeUtils.isHomePage(url)) {
      this.clearObservers();
      this.setFeedVisibility(true);
      this.isFeedBlocked = false;
    } else if (YouTubeUtils.isVideoPage(url)) {
      this.clearObservers();
      this.setSuggestionsVisibility(true);
      this.setCommentsVisibility(true);
      this.setPanelsVisibility(true);
    }
  }

  clearIntervals() {
    this.clearObservers();
  }

  clearObservers() {
    this.observers.forEach(obs => obs.disconnect());
    this.observers = [];
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers = [];
  }

  // Feed Focus (Homepage: Observer on browse renderer for load changes)
  focusFeed() {
    this.createObserver(
      'ytd-two-column-browse-results-renderer, ytd-browse',  // From home skeleton
      YouTubeUtils.isHomePage,
      YouTubeUtils.hasFeedLoaded,
      YouTubeUtils.isFeedHidden,
      () => this.setFeedVisibility(false)
    );
  }

  // Suggestions Focus (Watch: Observer on watch-flexy for sidebar additions)
  focusSuggestions() {
    this.createObserver(
      'ytd-watch-flexy, ytd-app',  // From watch skeleton
      YouTubeUtils.isVideoPage,
      YouTubeUtils.haveSuggestionsLoaded,
      YouTubeUtils.areSuggestionsHidden,
      () => this.setSuggestionsVisibility(false)
    );
  }

  // Comments Focus (Watch: Observer on primary for comment section loads)
  focusComments() {
    this.createObserver(
      'ytd-watch-flexy #primary, #primary',  // From watch skeleton
      YouTubeUtils.isVideoPage,
      YouTubeUtils.haveCommentsLoaded,
      YouTubeUtils.areCommentsHidden,
      () => this.setCommentsVisibility(false)
    );
  }

  // Panels Focus (Watch: Observer on app for miniplayer insertions)
  focusPanels() {
    this.createObserver(
      'ytd-app, body',  // Miniplayer floats under app
      YouTubeUtils.isVideoPage,
      YouTubeUtils.havePanelsLoaded,
      YouTubeUtils.arePanelsHidden,
      () => this.setPanelsVisibility(false)
    );
  }

  // Existing Block/Restore Methods (Kept, with Minor Elegance: Better Error Handling)
  hideFeed(feedParentNode: HTMLElement) {
    if (this.isFeedBlocked) return;
    this.isFeedBlocked = true;
    Array.from(feedParentNode.children).forEach((child) => {
      const htmlChild = child as HTMLElement;
      // Only hide if it's a content child (skip loaders/spacers)
      if (htmlChild.children.length > 0 || htmlChild.textContent?.trim()) {
        this.hiddenFeedElements.push(htmlChild);
        htmlChild.style.display = 'none';  // Style hide as backup to removal
      }
    });
  }

  showFeed() {
    this.quoteElement?.remove();
    this.quoteElement = null;
    this.hiddenFeedElements.forEach((child) => {
      child.style.display = '';  // Restore style
    });
    this.hiddenFeedElements = [];
    this.isFeedBlocked = false;
  }

  async injectQuote(feedParentNode: HTMLElement) {
    const settings = await browser.storage.local.get('showQuote');
    if (settings.showQuote === false) return;

    if (!this.quoteElement) {
      this.quoteElement = await quoteUtils.createSimpleQuoteElement();
      
      const isDark = YouTubeUtils.isDarkTheme();
      const backgroundColor = isDark ? '#0f0f0f' : '#f9f9f9';
      
      this.quoteElement.style.background = backgroundColor;
      this.quoteElement.style.marginTop = '24px';
      this.quoteElement.style.padding = '16px';  // Elegant: Add padding for readability
      this.quoteElement.style.borderRadius = '8px';  // Subtle integration

      const quoteText = this.quoteElement.querySelector('p:first-child') as HTMLElement;
      const quoteSource = this.quoteElement.querySelector('p:last-child') as HTMLElement;

      if (quoteText && quoteSource) {
        const textColor = isDark ? '#fff' : '#000';
        const sourceColor = isDark ? '#ccc' : '#666';
        quoteText.style.color = textColor;
        quoteSource.style.color = sourceColor;
        quoteText.style.marginBottom = '4px';  // Elegant spacing
      }

      // Append to end for natural flow
      feedParentNode.appendChild(this.quoteElement);
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

  // Generic Visibility Setters (Your Logic, with Fallback for Null)
  private setElementVisibility(
    element: Element | null,
    visible: boolean,
    elementsArray: Node[],
    arrayName: keyof Pick<YouTubeController, 'suggestionElements' | 'commentElements' | 'panelElements'>
  ) {
    if (!element) return;  // Elegant: Skip if not found

    if (!visible) {
      // Remove children in reverse for clean extraction
      const children = Array.from(element.children).reverse();
      children.forEach(child => {
        if (element.contains(child)) {
          element.removeChild(child);
        }
      });
      this[arrayName] = children;  // Store for restore
    } else {
      // Restore in original order (reverse the stored array back)
      const restoredChildren = this[arrayName].slice().reverse();
      restoredChildren.forEach(child => element.appendChild(child));
      (this[arrayName] as Node[]) = [];  // Clear
    }
  }

  setSuggestionsVisibility(visible: boolean) {
    this.setElementVisibility(
      YouTubeUtils.getSuggestions(),
      visible,
      this.suggestionElements,
      'suggestionElements'
    );
  }

  setCommentsVisibility(visible: boolean) {
    this.setElementVisibility(
      YouTubeUtils.getVideoComments(),
      visible,
      this.commentElements,
      'commentElements'
    );
  }

  setPanelsVisibility(visible: boolean) {
    this.setElementVisibility(
      YouTubeUtils.getPanels(),  // Miniplayer or legacy
      visible,
      this.panelElements,
      'panelElements'
    );
  }
}
