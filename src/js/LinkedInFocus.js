import LinkedInController from './LinkedIn/LinkedInController'
const URL = window.location.host
const ACTION = "focus"

let linkedInController = new LinkedInController()
linkedInController.handleActionOnPage(URL, ACTION)
