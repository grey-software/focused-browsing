import LinkedInUtils from './linkedin-utils'

describe('LinkedInUtils panel detection', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('finds panel elements directly via selector matches', () => {
    document.body.innerHTML = `
      <aside class="scaffold-layout__aside" id="right-panel"><div>panel</div></aside>
      <div data-testid="mainFeed"><div>post</div></div>
    `

    const panelIds = LinkedInUtils.getLinkedInPanels().map((panel) => panel.id)

    expect(panelIds).toEqual(['right-panel'])
  })

  it('infers only right-side panels from feed layout when selectors miss', () => {
    document.body.innerHTML = `
      <div id="layout-row">
        <div id="left-panel"><div>left</div></div>
        <div id="feed-column">
          <div data-testid="mainFeed"><div>post</div></div>
        </div>
        <div id="right-panel"><div>right</div></div>
      </div>
    `

    const panelIds = LinkedInUtils
      .getLinkedInPanels()
      .map((panel) => panel.id)
      .sort()

    expect(panelIds).toEqual(['right-panel'])
  })

  it('reports panels hidden only when all detected panels are hidden', () => {
    document.body.innerHTML = `
      <div id="layout-row">
        <div id="left-panel"><div>left</div></div>
        <div id="feed-column">
          <div data-testid="mainFeed"><div>post</div></div>
        </div>
        <div id="right-panel"><div>right</div></div>
      </div>
    `

    const panels = LinkedInUtils.getLinkedInPanels()
    expect(LinkedInUtils.arePanelsHidden()).toBe(false)

    panels.forEach((panel) => {
      panel.style.display = 'none'
    })

    expect(LinkedInUtils.arePanelsHidden()).toBe(true)
  })
})
