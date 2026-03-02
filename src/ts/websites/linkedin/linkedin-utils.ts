// CSS selectors for LinkedIn's feed and side panels, ordered from most-specific
// (data attributes) to least-specific (layout class names). The first match
// wins. When a selector stops working, add a new entry at the front rather than
// replacing — old selectors may still match on cached page versions.
// See selector-registry.ts for the broader selector health-check infrastructure.
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

/** Returns all panel elements matching PANEL_SELECTORS. */
function getLinkedInPanels(): HTMLElement[] {
  const panels: HTMLElement[] = []
  for (const selector of PANEL_SELECTORS) {
    const el = document.querySelector(selector) as HTMLElement | null
    if (el) panels.push(el)
  }
  return panels
}

function hasFeedLoaded(): boolean {
  const feed = getLinkedInFeed()
  if (!feed || !feed.children) return false
  return feed.children.length >= 1
}

function isFeedHidden(): boolean {
  const feed = getLinkedInFeed()
  if (!feed) return false
  // Feed children are individually hidden via style.display — check first non-quote child
  const firstContent = Array.from(feed.children).find(
    (child) => !child.classList.contains('focus-mode-quote') &&
               !child.classList.contains('focus-mode-linkedin-quote')
  ) as HTMLElement | undefined
  if (firstContent && firstContent.style.display === 'none') return true
  // Also check for presence of quote (indicates focus mode is active)
  return !!document.getElementById('focus-mode-linkedin-quote')
}

function arePanelsHidden(): boolean {
  const panels = getLinkedInPanels()
  return panels.length > 0 && panels.every(p => p.style.display === 'none')
}

function isHomePage(url: string): boolean {
  return /^https:\/\/(www\.)?linkedin\.com(\/(feed|home)?)?\/?(\?.*)?$/.test(url)
}

export default {
  getLinkedInFeed,
  getLinkedInPanels,
  isFeedHidden,
  arePanelsHidden,
  hasFeedLoaded,
  isHomePage,
  FEED_SELECTORS,
  PANEL_SELECTORS,
}
