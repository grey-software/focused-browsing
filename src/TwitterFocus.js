import TwitterController from './js/Twitter/TwitterController'
const ACTION = "focus"
let twitterController = new TwitterController()
twitterController.handleActionOnPage(currentURL, ACTION)

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
            console.log("short cut pressed")
        }
    }

    if (e.type == "keyup") {
        keyPressedStates = { "KeyF": false, "Shift": false, "KeyB": false }
    }

}

document.addEventListener("keydown", toggleFocus, false);
document.addEventListener("keyup", toggleFocus, false);


