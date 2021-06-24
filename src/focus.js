import LinkedInController from './js/LinkedIn/LinkedInController'
import TwitterController from './js/Twitter/TwitterController'


let focused = true
const currentURL = document.URL
let controller = null 
if(currentURL.includes("twitter.com")){
    controller = new TwitterController()
}else if(currentURL.includes("linkedin.com")){
    controller = new LinkedInController()
}

if(controller){
    controller.handleActionOnPage(currentURL, "focus")
}


let keyPressedStates = { "KeyF": false, "Shift": false, "KeyB": false }
const keyIsShortcutKey = (e) => {
    return e.key == "Shift" || e.code == "KeyB" || e.code == "KeyF"
}

const allKeysPressed = (keyPressedStates) => {
    console.log(keyPressedStates)
    let allKeysPressed = true
    Object.values(keyPressedStates).forEach(keyPressed =>
        allKeysPressed = allKeysPressed && keyPressed
    )
    return allKeysPressed
}

function toggleFocus(e) {
    console.log(e)
    if (e.type == "keydown") {
        if (keyIsShortcutKey(e)) {
            let keyCode = e.code
            console.log(keyCode)

            if (keyCode.includes("Shift")) { keyCode = "Shift" }
            keyPressedStates[keyCode] = true
        }
        if (allKeysPressed(keyPressedStates)) {
            let action = focused ? "unfocus": "focus"
            controller.handleActionOnPage(currentURL, action)
            focused = !focused
        }
    }
    if (e.type == "keyup") {
        keyPressedStates = { "KeyF": false, "Shift": false, "KeyB": false }
    }

}

document.addEventListener("keydown", toggleFocus, false);
document.addEventListener("keyup", toggleFocus, false);
