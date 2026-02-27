export const FEED_SELECTORS = [
  '[data-testid="mainFeed"]',
  '[aria-label="Main Feed"]',
  'div[role="main"][data-sdui-screen*="feed.MainFeed"]',
  'main#workspace',
  '.scaffold-layout__main'
]

export const PANEL_SELECTORS = [
  '[aria-label="Add to your feed"]',
  '.scaffold-layout__aside',
  '.scaffold-layout-container__aside'
]

export const AD_SELECTORS: string[] = []
export const FEED_AD_SELECTORS: string[] = []

function getLinkedInFeed(): Element | null {
  for (const selector of FEED_SELECTORS) {
    const element = document.querySelector(selector)
    if (element) {
      console.log(`LinkedIn feed found with selector: ${selector}`)
      return element
    }
  }
  console.log('LinkedIn feed not found with any selector')
  return null
}

function getLinkedInPanel(): Element | null {
  for (const selector of PANEL_SELECTORS) {
    const element = document.querySelector(selector)
    if (element) {
      console.log(`LinkedIn panel found with selector: ${selector}`)
      return element
    }
  }

  console.log('LinkedIn panel not found with any selector')
  return null
}

function getAdHeader(): Element | null {
  return null
}

function hasFeedLoaded(): boolean {
  const feed = getLinkedInFeed()
  if (!feed || !feed.children) return false
  return feed.children.length >= 1
}

function hasPanelLoaded(): boolean {
  const panel = getLinkedInPanel()
  if (!panel || !panel.children) return false
  return panel.children.length >= 1
}

function hasAdLoaded(): boolean {
  return false
}

function isFeedHidden(): boolean {
  const feed = getLinkedInFeed()
  if (!feed) return false
  const feedElement = feed as HTMLElement
  const style = window.getComputedStyle(feedElement)
  const feedIsHidden = style.display === 'none' || style.visibility === 'hidden' || feedElement.hidden
  const hasHiddenClass = feedElement.classList.contains('focus-mode-linkedin-feed-hidden')
  const focusQuote = document.querySelector('.focus-quote, .focus-quote-simple, .focus-mode-linkedin-quote')
  const hasInjectedQuote = !!document.getElementById('focus-mode-linkedin-quote')
  return feedIsHidden || hasHiddenClass || !!focusQuote || hasInjectedQuote
}

function isPanelHidden(): boolean {
  const panel = getLinkedInPanel()
  if (!panel) return true
  const element = panel as HTMLElement
  const style = window.getComputedStyle(element)
  return style.display === 'none' || style.visibility === 'hidden' || element.hidden
}

function isAdHidden(): boolean {
  return true
}

function isHomePage(url: string): boolean {
  if (url.includes('linkedin.com')) {
    // More permissive LinkedIn homepage detection
    const isHome = url.includes('/feed') || 
                   url === 'https://www.linkedin.com/' || 
                   url === 'https://www.linkedin.com/home' ||
                   url === 'https://linkedin.com/' ||
                   url === 'https://linkedin.com/home' ||
                   url.match(/https:\/\/(www\.)?linkedin\.com\/?$/) ||
                   url.match(/https:\/\/(www\.)?linkedin\.com\/feed/) ||
                   url.match(/https:\/\/(www\.)?linkedin\.com\/home/);
    
    console.log(`LinkedIn isHomePage: URL="${url}" -> ${isHome}`);
    return !!isHome;
  }
  return false
}

function getFeedAdElements(): HTMLElement[] {
  return []
}

// New utility functions for observer pattern
function getAllObservableContainers(): Element[] {
  const containers: Element[] = [];
  
  // Add feed container
  const feed = getLinkedInFeed();
  if (feed) {
    containers.push(feed);
    console.log('LinkedIn: Added feed container for observation');
  }
  
  // Add panel container
  const panel = getLinkedInPanel(); 
  if (panel) {
    containers.push(panel);
    console.log('LinkedIn: Added panel container for observation');
  }
  
  console.log(`LinkedIn: Total observable containers found: ${containers.length}`)
  return containers
}

function isLinkedInContentLoaded(): boolean {
  const feed = getLinkedInFeed()
  const panel = getLinkedInPanel()
  
  // Consider content loaded if we have either feed or panel
  return !!(feed?.children?.length || panel?.children?.length)
}

export default {
  getLinkedInFeed,
  getLinkedInPanel,
  getAdHeader,
  isFeedHidden,
  isPanelHidden,
  isAdHidden,
  hasFeedLoaded,
  hasPanelLoaded,
  hasAdLoaded,
  isHomePage,
  getFeedAdElements,
  getAllObservableContainers,
  isLinkedInContentLoaded,
  FEED_SELECTORS,
  PANEL_SELECTORS,
  AD_SELECTORS,
  FEED_AD_SELECTORS,
}
