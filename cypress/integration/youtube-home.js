import YoutubeController from "../../src/ts/websites/youtube/youtube-controller"
import { Website, FocusMode } from "../../src/ts/types"
import { it } from "mocha"

const websiteController = new YoutubeController()
const currentWebsite = Website.Youtube

describe('Test YT Home', () => {
    it('Loads the page and initializes controllers', () => {
        cy.visit('https://youtube.com')
        cy.wait(5000)
        websiteController.focus(FocusMode.Focused)
    })

    // it('Checking if the feed is blocked', () => {

    // })
})