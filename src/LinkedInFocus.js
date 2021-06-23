console.log("creating linkedin controller: "+ new Date().toLocaleTimeString())
import LinkedInController from './js/LinkedIn/LinkedInController'
const ACTION = "focus"
const currentURL = "https://www.linkedin.com/feed/"
let linkedInController = new LinkedInController()
linkedInController.handleActionOnPage(currentURL, ACTION)
