import YouTubeUtils from '../../../src/ts/websites/youtube/youtube-utils'

describe('Test YT Home', () => {
  it('Loads the page and hides the feed', (done) => {
    cy.visit('https://youtube.com')
    cy.wait(3000)

    cy.document().then((doc) => {
      let feed = YouTubeUtils.getYouTubeFeed(doc)
      console.log(feed)

      if (feed) {
        feed.removeChild(feed.childNodes[0])
      }
      done()
    })
  })

  it('Checks if the feed is blocked', () => {
    cy.get('ytd-rich-item-renderer').should('have.length', 0)
  })
})
