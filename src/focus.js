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


function readFocusDB() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("focusDB", function (data) {
            if (data != undefined) {
                console.log("resolve")
                resolve(data);
            } else {
                reject();
            }
        });
    })
}

async function getVarFromLocalStorage(name) {
    return new Promise(function (resolve, reject) {
        try {
            chrome.storage.local.get([name], function (items) {
                var target = items[name]
                console.log(target)
                resolve(target)
            });
        }
        catch {
            reject()
        }
    })
}

async function setVarInLocalStorage(name, value) {
    return new Promise(function (resolve, reject) {
        var obj = {};
        obj[name] = value;
        chrome.storage.local.set(obj, function () {
            resolve("var set successfully")
        });
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

    // let focusDB = getDB()
    // console.log(focusDB)
    await setVarInLocalStorage('focusDB', { premium: false })
    await getVarFromLocalStorage('focusDB')

    // if(controller != null){
    //     sendAction(currentURL)
    // }
})();