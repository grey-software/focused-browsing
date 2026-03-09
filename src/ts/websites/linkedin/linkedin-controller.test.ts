import LinkedInController from './linkedin-controller'
import LinkedInUtils from './linkedin-utils'

jest.mock('./linkedin-utils', () => ({
  __esModule: true,
  default: {
    isHomePage: jest.fn(),
    getLinkedInFeed: jest.fn(),
    getLinkedInPanels: jest.fn(),
    arePanelsHidden: jest.fn(),
  },
}))

describe('LinkedInController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('keeps panels hidden in unfocused mode while restoring the feed', () => {
    const feed = document.createElement('div')
    const panel = document.createElement('aside')

    Object.defineProperty(document, 'URL', {
      value: 'https://www.linkedin.com/feed/',
      writable: true,
    })

    ;(LinkedInUtils.isHomePage as jest.Mock).mockReturnValue(true)
    ;(LinkedInUtils.getLinkedInFeed as jest.Mock).mockReturnValue(feed)
    ;(LinkedInUtils.getLinkedInPanels as jest.Mock).mockReturnValue([panel])
    ;(LinkedInUtils.arePanelsHidden as jest.Mock).mockReturnValue(false)

    const controller = new LinkedInController()
    controller.unfocus()

    expect(panel.style.display).toBe('')
    expect(panel.style.visibility).toBe('hidden')
    expect(panel.style.opacity).toBe('0')
    expect(panel.style.pointerEvents).toBe('none')
  })
})
