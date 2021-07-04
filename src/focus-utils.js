const keyIsShortcutKey = (e) => {
  return e.key == 'Shift' || e.code == 'KeyB' || e.code == 'KeyF'
}

const shortcutKeysPressed = (keyPressedStates) => {
  let allKeysPressed = true
  Object.values(keyPressedStates).forEach((keyPressed) => (allKeysPressed = allKeysPressed && keyPressed))
  return allKeysPressed
}

const isURLValid = (url) => {
  return url.includes('twitter.com') || url.includes('linkedin.com')
}

const debounce = (func, delay) => {
  let inDebounce
  return function () {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}


const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function () {
    const context = this
    const args = arguments
    console.log("i am getting called at least")
    if (!lastRan) {
      console.log("lastRan not defined")
      console.log("applying function call")
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc)
      }
      console.log("last function run was timed at: " + JSON.stringify(lastRan))
      // if (Date.now() - lastRan >= limit) {
      //   func.apply(context, args)
      //   lastRan = Date.now()
      // } else {
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

// limit = 50 t0=100, t1=200 

// throttle.
module.exports = { keyIsShortcutKey, shortcutKeysPressed, isURLValid, debounce, throttle }
