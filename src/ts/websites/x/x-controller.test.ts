import XController from './x-controller'
import XUtils from './x-utils'

jest.mock('./x-utils', () => ({
  __esModule: true,
  default: {
    isHomePage: jest.fn(),
    getXFeed: jest.fn(),
    getXSidebar: jest.fn(),
    hasFeedLoaded: jest.fn(),
    isFeedHidden: jest.fn(),
    isSidebarHidden: jest.fn(),
    isDarkTheme: jest.fn(),
  },
}))

describe('XController', () => {
  const originalURL = document.URL

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    Object.defineProperty(document, 'URL', {
      value: originalURL,
      writable: true,
    })
  })

  it('keeps the sidebar hidden in unfocused mode while restoring the feed', () => {
    const feed = document.createElement('div')
    const feedItem = document.createElement('div')
    const sidebar = document.createElement('aside')

    feed.appendChild(feedItem)

    Object.defineProperty(document, 'URL', {
      value: 'https://x.com/home',
      writable: true,
    })

    ;(XUtils.isHomePage as jest.Mock).mockReturnValue(true)
    ;(XUtils.getXFeed as jest.Mock).mockReturnValue(feed)
    ;(XUtils.getXSidebar as jest.Mock).mockReturnValue(sidebar)
    ;(XUtils.hasFeedLoaded as jest.Mock).mockReturnValue(true)
    ;(XUtils.isFeedHidden as jest.Mock).mockReturnValue(false)
    ;(XUtils.isSidebarHidden as jest.Mock).mockReturnValue(false)
    ;(XUtils.isDarkTheme as jest.Mock).mockReturnValue(false)

    const controller = new XController()
    controller.focus()
    controller.unfocus()

    expect(feedItem.style.display).not.toBe('none')
    expect(sidebar.style.display).toBe('none')
  })
})
