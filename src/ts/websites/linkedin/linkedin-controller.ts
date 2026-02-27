import LinkedInUtils from './linkedin-utils'
import WebsiteController from '../website-controller'
import { DistractionTarget } from '../distraction-watcher'
import { browser } from 'webextension-polyfill-ts';
import quoteUtils from '../../quotes';

export default class LinkedInController extends WebsiteController {
  // Quote and feed management
  quoteElement: HTMLDivElement | null
  isFeedBlocked: boolean
  private readonly hiddenFeedClass: string = 'focus-mode-linkedin-feed-hidden'
  private readonly feedStyleId: string = 'focus-mode-linkedin-feed-style'
  
  // Clean utility-based storage
  panelDisplayValues: Map<HTMLElement, string> = new Map()
  
  // Simplified state management
  private isCreatingQuote: boolean = false
  private currentFocusMode: 'focused' | 'unfocused' | null = null
  private isApplyingFocusMode: boolean = false
  private lastFocusApplyAt: number = 0
  private readonly quoteElementId: string = 'focus-mode-linkedin-quote'
  private rightPanelDisplayValues: Map<HTMLElement, string> = new Map()
  private startupReapplyTimeouts: number[] = []

  constructor() {
    super()
    this.quoteElement = null
    this.isFeedBlocked = false
    this.ensureFeedStyle()

    this.addStorageListener();
    console.log('LinkedInController: Initialized with standardized observer management');
  }

  private ensureFeedStyle(): void {
    if (document.getElementById(this.feedStyleId)) return

    const style = document.createElement('style')
    style.id = this.feedStyleId
    style.textContent = `
      .${this.hiddenFeedClass} > :not(.focus-mode-linkedin-quote) {
        display: none !important;
      }
    `

    document.head.append(style)
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

  private setupContentObserver(): void {
    const target = document.body ?? document.documentElement

    const distractionTarget: DistractionTarget = {
      target,
      whenFound: () => this.handleContentChanges(),
      options: {
        childList: true,
        subtree: true
      }
    }

    console.log('LinkedIn: Setting up watcher for stable root container')
    this.watchFor('linkedin-content', distractionTarget)
  }

  private clearStartupReapplyTimeouts(): void {
    this.startupReapplyTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
    this.startupReapplyTimeouts = []
  }

  private scheduleStartupReapply(): void {
    this.clearStartupReapplyTimeouts()

    const delays = [300, 1200, 2500]
    delays.forEach((delay) => {
      const timeoutId = window.setTimeout(() => {
        if (this.currentFocusMode !== 'focused') return
        if (!LinkedInUtils.isHomePage(document.URL)) return

        console.log(`LinkedIn: Startup re-apply at ${delay}ms`)
        this.applyFocusMode()
      }, delay)

      this.startupReapplyTimeouts.push(timeoutId)
    })
  }

  private handleContentChanges(): void {
    if (this.currentFocusMode === 'focused') {
      const now = Date.now()
      if (now - this.lastFocusApplyAt < 500) return
      if (this.isApplyingFocusMode) return
      this.isApplyingFocusMode = true
      this.lastFocusApplyAt = now
      this.applyFocusMode();
      this.isApplyingFocusMode = false
    } else if (this.currentFocusMode === 'unfocused') {
      // Ensure content is visible in unfocus mode
      this.applyUnfocusMode();
    }
  }

  focus() {
    console.log('LinkedInController: Entering focus mode with standardized observer management.');
    console.log(`LinkedIn: Current URL: ${document.URL}`);
    this.currentFocusMode = 'focused';
    
    // Clear any existing intervals from legacy code
    this.clearAllIntervals();
    
    // Apply immediately to minimize initial feed flash, then observe updates
    this.applyFocusMode();
    this.lastFocusApplyAt = Date.now();
    this.setupContentObserver();
    this.scheduleStartupReapply();
  }

  unfocus() {
    console.log('LinkedInController: Exiting focus mode.');
    console.log(`LinkedIn: Current URL: ${document.URL}`);
    this.currentFocusMode = 'unfocused';
    
    // Stop all distraction watching using base class method
    this.stopWatchingAll();
    this.clearStartupReapplyTimeouts();
    
    // Clear all intervals
    this.clearAllIntervals();
    
    // Restore all hidden content
    this.applyUnfocusMode();
  }

  private applyFocusMode(): void {
    const url = document.URL;
    console.log(`LinkedIn: Checking homepage for URL: ${url}`);
    console.log(`LinkedIn: isHomePage result: ${LinkedInUtils.isHomePage(url)}`);
    
    if (!LinkedInUtils.isHomePage(url)) {
      console.log('LinkedIn: Not a homepage, skipping focus mode');
      return;
    }
    
    console.log('LinkedIn: Applying focus mode immediately');
    
    // Log DOM element availability
    const feed = LinkedInUtils.getLinkedInFeed();
    const panel = LinkedInUtils.getLinkedInPanel();
    console.log(`LinkedIn DOM elements - Feed: ${!!feed}, Panel: ${!!panel}`);
    console.log(`LinkedIn Load status - Feed: ${LinkedInUtils.hasFeedLoaded()}, Panel: ${LinkedInUtils.hasPanelLoaded()}`);
    
    // Apply all focus features immediately
    this.focusFeeds();
    this.focusPanel();
  }

  private applyUnfocusMode(): void {
    const url = document.URL;
    console.log(`LinkedIn: applyUnfocusMode() - URL: ${url}`);
    console.log(`LinkedIn: isHomePage result: ${LinkedInUtils.isHomePage(url)}`);
    
    if (!LinkedInUtils.isHomePage(url)) {
      console.log('LinkedIn: Not a homepage, skipping unfocus mode');
      return;
    }
    
    console.log('LinkedIn: Applying unfocus mode');
    
    // Restore all hidden content
    this.setFeedVisibility(true);
    this.setPanelVisibility(true);
    
    this.isFeedBlocked = false;
    
    console.log('LinkedIn: Unfocus mode applied');
  }

  private focusFeeds(): void {
    console.log('LinkedIn: focusFeeds() called');
    const feedElement = LinkedInUtils.getLinkedInFeed() as HTMLElement | null

    if (this.isFeedBlocked) {
      if (feedElement) {
        this.hideFeed(feedElement)
        if (!this.quoteElement || !document.contains(this.quoteElement)) {
          this.quoteElement = null
          this.injectQuote(feedElement)
        }
      }
      console.log('LinkedIn: Feed already blocked, enforcing hidden state');
      return;
    }
    
    const feedLoaded = LinkedInUtils.hasFeedLoaded();
    const feedHidden = LinkedInUtils.isFeedHidden();
    console.log(`LinkedIn: Feed status - Loaded: ${feedLoaded}, Hidden: ${feedHidden}`);
    
    if (feedLoaded && !feedHidden) {
      console.log('LinkedIn: Hiding feed');
      this.setFeedVisibility(false);
    } else {
      console.log('LinkedIn: Feed not ready for hiding');
    }
  }

  private focusPanel(): void {
    console.log('LinkedIn: focusPanel() called');
    const panelLoaded = LinkedInUtils.hasPanelLoaded();
    const panelHidden = LinkedInUtils.isPanelHidden();
    console.log(`LinkedIn: Panel status - Loaded: ${panelLoaded}, Hidden: ${panelHidden}`);

    console.log('LinkedIn: Enforcing hidden panel state');
    this.setPanelVisibility(false);
  }

  clearIntervals() {
    // Use base class method for distraction watching cleanup
    this.stopWatchingAll();
    this.clearAllIntervals();
  }

  hideFeed(feedParentNode: HTMLElement) {
    this.isFeedBlocked = true
    feedParentNode.classList.add(this.hiddenFeedClass)
  }

  showFeed() {
    console.log('LinkedIn: showFeed() called');
    document.querySelectorAll(`#${this.quoteElementId}`).forEach((quote) => quote.remove())
    this.quoteElement?.remove();
    this.quoteElement = null;

    const feedElement = LinkedInUtils.getLinkedInFeed() as HTMLElement | null
    feedElement?.classList.remove(this.hiddenFeedClass)
    console.log('LinkedIn: Feed container restored via visibility restoration');
    
    this.isFeedBlocked = false;
  }

  async injectQuote(feedParentNode: HTMLElement) {
    if (this.isCreatingQuote) return;
    
    const settings = await browser.storage.local.get('showQuote');
    if (settings.showQuote === false) return;

    const existingQuote = document.getElementById(this.quoteElementId) as HTMLDivElement | null
    if (existingQuote) {
      this.quoteElement = existingQuote
      return
    }

    if (this.quoteElement && document.contains(this.quoteElement)) {
      return
    }

    if (!this.quoteElement) {
      this.isCreatingQuote = true;
      try {
        this.quoteElement = await quoteUtils.createSimpleQuoteElement();
        this.quoteElement.id = this.quoteElementId
        this.quoteElement.classList.add('focus-mode-linkedin-quote')
        feedParentNode.prepend(this.quoteElement!)
        console.log('LinkedIn: Quote injected successfully');
      } catch (error) {
        console.error('LinkedIn: Failed to inject quote:', error);
      } finally {
        this.isCreatingQuote = false;
      }
    }
  }

  async setFeedVisibility(visible: boolean) {
    const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
    if (!feedParentNode) return;

    if (!visible) {
      this.hideFeed(feedParentNode);
      await this.injectQuote(feedParentNode);
    } else {
      this.showFeed();
    }
  }

  private findFeedRowContainer(feedElement: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = feedElement.parentElement
    for (let depth = 0; depth < 8 && current; depth += 1) {
      const children = Array.from(current.children)
        .filter((child): child is HTMLElement => child instanceof HTMLElement)

      const hasFeedChild = children.some((child) => child.contains(feedElement))
      const nonFeedChildren = children.filter((child) => !child.contains(feedElement))

      if (hasFeedChild && nonFeedChildren.length > 0) {
        return current
      }

      current = current.parentElement
    }

    return null
  }

  private getRightPanelCandidates(feedElement: HTMLElement): HTMLElement[] {
    const feedRow = this.findFeedRowContainer(feedElement)
    if (!feedRow) return []

    const rowChildren = Array.from(feedRow.children)
      .filter((child): child is HTMLElement => child instanceof HTMLElement)

    const feedColumnIndex = rowChildren.findIndex((child) => child.contains(feedElement))
    if (feedColumnIndex === -1) return []

    return rowChildren
      .filter((child, index) => index > feedColumnIndex)
      .filter((child) => child.children.length > 0)
      .filter((child) => child.id !== this.quoteElementId)
      .filter((child) => !child.classList.contains('focus-quote'))
      .filter((child) => !child.classList.contains('focus-quote-simple'))
  }

  setPanelVisibility(visible: boolean) {
    console.log(`LinkedIn: setPanelVisibility(${visible}) called`);
    const feed = LinkedInUtils.getLinkedInFeed() as HTMLElement | null
    if (!feed) return

    const rightPanels = this.getRightPanelCandidates(feed)

    if (!visible) {
      if (rightPanels.length === 0) {
        console.log('LinkedIn: No right-side panel candidates found to hide')
        return
      }

      rightPanels.forEach((panel) => {
        if (!this.rightPanelDisplayValues.has(panel)) {
          this.rightPanelDisplayValues.set(panel, panel.style.display)
        }
        if (panel.style.display !== 'none') {
          panel.style.setProperty('display', 'none', 'important')
        }
      })

      console.log('LinkedIn: Hiding right-side panel(s) via direct visibility change');
    } else {
      this.rightPanelDisplayValues.forEach((previousDisplay, panel) => {
        if (previousDisplay === '') {
          panel.style.removeProperty('display')
        } else {
          panel.style.setProperty('display', previousDisplay)
        }
      })
      this.rightPanelDisplayValues.clear()
      console.log('LinkedIn: Showing right-side panel(s) via visibility restoration');
    }
  }
}