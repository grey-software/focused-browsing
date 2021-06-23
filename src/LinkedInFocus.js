console.log("creating linkedin controller: "+ new Date().toLocaleTimeString())
import LinkedInController from './js/LinkedIn/LinkedInController'
const ACTION = "focus"
const currentURL = "https://www.linkedin.com/feed/"
let linkedInController = new LinkedInController()
linkedInController.handleActionOnPage(currentURL, ACTION)

let keyPressedStates = {"f": false, "Shift": false, "Control":false}
let keysLeftToShortcut = 3
const keyIsShortcutKey = (e) => {
    return e.key == "Meta" || e.key == "Control" || e.key == "Shift" || e.key == "f"
}

const allKeysPressed = (keyPressedStates) => {
    console.log(keyPressedStates)
    let allKeysPressed = true
    Object.values(keyPressedStates).forEach(keyPressed => 
        allKeysPressed = allKeysPressed && keyPressed
    )
    return allKeysPressed
}

function toggleFocus(e){
    console.log(e)
    if(e.type == "keydown"){
        if(keyIsShortcutKey(e)){
            let key = e.key
            if (key == "Meta") key = "Control"
            keyPressedStates[key] = true
        }
        if(allKeysPressed(keyPressedStates)){
            console.log("short cut pressed")
        }
    }

    if(e.type == "keyup"){
        keyPressedStates = {"f": false, "Shift": false, "Control":false}
    }
    
}

document.addEventListener("keydown",toggleFocus,false);
document.addEventListener("keyup",toggleFocus,false);


