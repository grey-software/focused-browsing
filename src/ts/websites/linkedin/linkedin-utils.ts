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
  for (const selector of PANEL_SELECTORS) {
    const matchedElements = Array.from(document.querySelectorAll(selector))
      .filter((element): element is HTMLElement => element instanceof HTMLElement)

    if (matchedElements.length > 0) return matchedElements
  }

  return inferRightPanelsFromFeedLayout()
}

/**
 * Fallback panel detection that infers right-side columns from feed layout structure.
 * This keeps startup blocking resilient when LinkedIn changes panel CSS classes.
 */
function inferRightPanelsFromFeedLayout(): HTMLElement[] {
  const feed = getLinkedInFeed()
  if (!(feed instanceof HTMLElement)) return []

  let current: HTMLElement | null = feed.parentElement
  for (let depth = 0; depth < 10 && current; depth += 1) {
    const rowChildren = Array.from(current.children)
      .filter((child): child is HTMLElement => child instanceof HTMLElement)
    const feedColumnIndex = rowChildren.findIndex((child) => child.contains(feed))

    if (feedColumnIndex !== -1) {
      const rightPanels = rowChildren
        .slice(feedColumnIndex + 1)
        .filter((child) => child.children.length > 0)
        .filter((child) => child.id !== 'focus-mode-linkedin-quote')
        .filter((child) => !child.classList.contains('focus-quote'))

      if (rightPanels.length > 0) return rightPanels
    }

    current = current.parentElement
  }

  return []
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
