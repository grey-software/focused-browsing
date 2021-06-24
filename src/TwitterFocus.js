import TwitterController from './js/Twitter/TwitterController'
let focused = true
let action = "focus"
let twitterController = new TwitterController()
let currentURL = document.URL
twitterController.handleActionOnPage(currentURL, action)

let keyPressedStates = { "KeyF": false, "Shift": false, "KeyB": false }
let keysLeftToShortcut = 3
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
            twitterController.handleActionOnPage(currentURL, action)
            focused = !focused
        }
    }

    if (e.type == "keyup") {
        keyPressedStates = { "KeyF": false, "Shift": false, "KeyB": false }
    }

}

document.addEventListener("keydown", toggleFocus, false);
document.addEventListener("keyup", toggleFocus, false);


