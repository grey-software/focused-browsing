import LinkedInController from './js/LinkedIn/LinkedInController'
import TwitterController from './js/Twitter/TwitterController'


let focused = true
const currentURL = document.URL
let controller = null

let pageKey = ""
let focusdb = null
let initial = true



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
    if (e.type == "keydown") {
        if (keyIsShortcutKey(e)) {
            let keyCode = e.code
            if (keyCode.includes("Shift")) { keyCode = "Shift" }
            keyPressedStates[keyCode] = true
        }
        if (allKeysPressed(keyPressedStates)) {
            sendAction()
        }
    }
    if (e.type == "keyup") {
        keyPressedStates = { "KeyF": false, "Shift": false, "KeyB": false }
    }

}

document.addEventListener("keydown", toggleFocus, false);
document.addEventListener("keyup", toggleFocus, false);


function sendAction() {
    if(!focusdb[pageKey]) {
        console.log("here handling action")
        controller.handleActionOnPage(currentURL, "focus")
    } else{
        console.log("here handling action")
        controller.handleActionOnPage(currentURL, "unfocus")
    }
    focusdb[pageKey] = !focusdb[pageKey]
}






(function () {  
    if (currentURL.includes("twitter.com")) {
        controller = new TwitterController()
        pageKey = "twitter"
    } else if (currentURL.includes("linkedin.com")) {
        controller = new LinkedInController()
        pageKey = "linkedin"
    }


    focusdb = {"twitter": false, "linkedin":false}

    if(pageKey != null){
        sendAction()
    }
})();