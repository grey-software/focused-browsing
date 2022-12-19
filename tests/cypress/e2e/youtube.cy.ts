import YouTubeUtils from '../../../src/ts/websites/youtube/youtube-utils'

// describe('Test YT Home', () => {
//   it('Loads the page and hides the feed', (done) => {
//     cy.visit('https://youtube.com')
//     cy.wait(3000)

//     cy.document().then((doc) => {
//       let feed = YouTubeUtils.getYouTubeFeed(doc)
//       console.log(feed)

//       if (feed) {
//         feed.removeChild(feed.childNodes[0])
//       }
//       done()
//     })
//   })

//   it('Checks if the feed is blocked', () => {
//     cy.get('ytd-rich-item-renderer').should('have.length', 0)
//   })
// })

describe('Test YT Video Page', () => {
  it('Loads the video page', (done) => {
    cy.visit('https://www.youtube.com/watch?v=eU6k7rvum-M&themeRefresh=1')
  })

  it('Hides the comments and suggestions', (done) => {
    cy.document().then((doc) => {
      let comments = YouTubeUtils.getVideoComments(doc)
      let suggestions = YouTubeUtils.getYoutubeSuggestions(doc)
      if (comments && suggestions) {
        for (let i = 0; i < comments.children.length; i++) {
          comments.removeChild(comments.children[i])
        }
        for (let i = 0; i < suggestions.children.length; i++) {
          suggestions.removeChild(suggestions.children[i])
        }
      }
      done()
    })
  })

  it('Checks if the comments and suggestions are blocked', () => {
    cy.get('ytd-compact-video-renderer').should('have.length', 0)
    cy.get('ytd-comment-renderer').should('have.length', 0)
  })
})
