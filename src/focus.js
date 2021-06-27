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


async function sendAction() {
    console.log(focusdb)
    if(!focusdb[pageKey]) {
        console.log("here handling action")
        controller.handleActionOnPage(currentURL, "focus")
    } else{
        console.log("here handling action")
        controller.handleActionOnPage(currentURL, "unfocus")
    }
    focusdb[pageKey] = !focusdb[pageKey]
    await setVarInLocalStorage("focusdb", focusdb)
}




async function getVarFromLocalStorage(name) {
    return new Promise(function (resolve, reject) {
        try {
            chrome.storage.local.get([name], function (items) {
                var target = items[name]
                console.log("getting db")
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


(async function () {

    if (window.hasRun === true){
        console.log("set flag")
        return true;
    }

    window.hasRun = true 
    
    if (currentURL.includes("twitter.com")) {
        controller = new TwitterController()
        pageKey = "twitter"
    } else if (currentURL.includes("linkedin.com")) {
        controller = new LinkedInController()
        pageKey = "linkedin"
    }


    // focusdb = await getVarFromLocalStorage('focusDB')

    // if(pageKey != null){
    //     if(!focusdb[pageKey]){
    //         controller.handleActionOnPage(currentURL, "focus")
    //         focusdb[pageKey] = !focusdb[pageKey]
    //         await setVarInLocalStorage("focusdb", focusdb)
    //     }
    // }
    // console.log(focusdb)

    console.log("getting here")

    window.hasRun

})();