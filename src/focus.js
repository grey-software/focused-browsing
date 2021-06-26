import LinkedInController from './js/LinkedIn/LinkedInController'
import TwitterController from './js/Twitter/TwitterController'


let focused = true
const currentURL = document.URL
let controller = null

let focusDB = null



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
            sendAction(currentURL)
        }
    }
    if (e.type == "keyup") {
        keyPressedStates = { "KeyF": false, "Shift": false, "KeyB": false }
    }

}

document.addEventListener("keydown", toggleFocus, false);
document.addEventListener("keyup", toggleFocus, false);


function sendAction(webPage) {
    let key = "twitter" ? webPage.includes("twitter.com") : "linkedin"
    if (!focusDB[key]) {
        twitterController.handleActionOnPage(webPage, "focus")
    } else {
        twitterController.handleActionOnPage(webPage, "unfocus")
    }
    focusDB[key] = !focusDB[key]
}


async function readFocusDB() {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await chrome.storage.local.get("focusDB")
            console.log("Success: Accepting")
            resolve(data)
        } catch {
            console.log("Error: Rejecting")
            reject();
        }
    })
}

async function getDB() {
    let db = await readFocusDB()
    return db
}

(async function () {
    if (currentURL.includes("twitter.com")) {
        controller = new TwitterController()
    } else if (currentURL.includes("linkedin.com")) {
        controller = new LinkedInController()
    }

    let focusDB = await getDB()
    console.log(focusDB)
    // if(controller != null){
    //     sendAction(currentURL)
    // }
})();