// CSS selectors for X.com's feed and sidebar, ordered from most-specific
// (data-testid) to least-specific (ARIA / layout). The first match wins.
// See selector-registry.ts for the broader selector health-check infrastructure.
export const FEED_SELECTORS = [
  '[data-testid="primaryColumn"]',
  '[aria-label="Home timeline"]',
  'main[role="main"] > div > div > div > div:first-child',
]

export const SIDEBAR_SELECTORS = [
  '[data-testid="sidebarColumn"]',
  '[aria-label="Search"]',
  'main[role="main"] > div > div > div > div:last-child',
]

function getXFeed(): Element | null {
  for (const selector of FEED_SELECTORS) {
    const element = document.querySelector(selector)
    if (element) {
      console.log(`X feed found with selector: ${selector}`)
      return element
    }
  }
  console.log('X feed not found with any selector')
  return null
}

function getXSidebar(): HTMLElement | null {
  for (const selector of SIDEBAR_SELECTORS) {
    const element = document.querySelector(selector)
    if (element instanceof HTMLElement) {
      console.log(`X sidebar found with selector: ${selector}`)
      return element
    }
  }
  console.log('X sidebar not found with any selector')
  return null
}

function hasFeedLoaded(): boolean {
  const feed = getXFeed()
  if (!feed || !feed.children) return false
  return feed.children.length >= 1
}

function isFeedHidden(): boolean {
  const feed = getXFeed()
  if (!feed) return false
  const firstContent = Array.from(feed.children).find(
    (child) => !child.classList.contains('focus-mode-quote')
  ) as HTMLElement | undefined
  return !!(firstContent && firstContent.style.display === 'none')
}

function isSidebarHidden(): boolean {
  const sidebar = getXSidebar()
  return !!(sidebar && sidebar.style.display === 'none')
}

function isHomePage(url: string): boolean {
  return /^https:\/\/(www\.)?(x|twitter)\.com(\/(home)?)?\/?(\?.*)?$/.test(url)
}

function isDarkTheme(): boolean {
  // X.com sets a background-color on <body> — dark themes use dark backgrounds
  const bg = getComputedStyle(document.body).backgroundColor
  const match = bg.match(/\d+/g)
  if (!match) return false
  const [r, g, b] = match.map(Number)
  return (r + g + b) / 3 < 128
}

export default {
  getXFeed,
  getXSidebar,
  hasFeedLoaded,
  isFeedHidden,
  isSidebarHidden,
  isHomePage,
  isDarkTheme,
  FEED_SELECTORS,
  SIDEBAR_SELECTORS,
}
