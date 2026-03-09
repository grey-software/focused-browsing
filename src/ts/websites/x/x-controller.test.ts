import XController from './x-controller'
import XUtils from './x-utils'

jest.mock('./x-utils', () => ({
  __esModule: true,
  default: {
    isHomePage: jest.fn(),
    getXFeed: jest.fn(),
    getXSidebar: jest.fn(),
    isSidebarHidden: jest.fn(),
    isDarkTheme: jest.fn(),
  },
}))

describe('XController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('keeps the sidebar hidden in unfocused mode while restoring the feed', () => {
    const feed = document.createElement('div')
    const sidebar = document.createElement('aside')

    Object.defineProperty(document, 'URL', {
      value: 'https://x.com/home',
      writable: true,
    })

    ;(XUtils.isHomePage as jest.Mock).mockReturnValue(true)
    ;(XUtils.getXFeed as jest.Mock).mockReturnValue(feed)
    ;(XUtils.getXSidebar as jest.Mock).mockReturnValue(sidebar)
    ;(XUtils.isSidebarHidden as jest.Mock).mockReturnValue(false)
    ;(XUtils.isDarkTheme as jest.Mock).mockReturnValue(false)

    const controller = new XController()
    controller.unfocus()

    expect(sidebar.style.display).toBe('none')
  })
})
