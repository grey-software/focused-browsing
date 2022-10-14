import { browser } from 'webextension-polyfill-ts'
const IFRAME_ClASS = 'focus-card'

function removeFocusedBrowsingCards() {
  try {
    let cards = document.getElementsByClassName(IFRAME_ClASS)
    Array.from(cards).forEach(function (el) {
      el.remove()
    })
  } catch (err) {
    //   sendLogToBackground(port,"CURRENTLY NO IFRAMES ON THE SCREEN")
  }
}

const isURLValid = (url: string) => {
  return (
    url.includes('twitter.com') ||
    url.includes('linkedin.com') ||
    url.includes('youtube.com') ||
    url.includes('github.com')
  )
}

async function getFromLocalStorage(name: string) {
  let storeObject = await browser.storage.local.get(name)
  return storeObject[name]
}

function setInLocalStorage(storageName: string, storageObj: any) {
  var obj: any = {}
  obj[storageName] = storageObj
  browser.storage.local.set(obj)
}

function fixTestUrl(url: String) {
  return url.substring(0, url.indexOf('/__/#/specs'))
}

export default {
  isURLValid,
  getFromLocalStorage,
  setInLocalStorage,
  removeFocusedBrowsingCards,
  fixTestUrl,
}
