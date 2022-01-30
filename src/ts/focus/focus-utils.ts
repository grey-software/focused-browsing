import { browser } from 'webextension-polyfill-ts'

const isURLValid = (url: string) => {
  return (
    url.includes('twitter.com') ||
    url.includes('linkedin.com') ||
    url.includes('youtube.com') ||
    url.includes('facebook.com') ||
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

export default {
  isURLValid,
  getFromLocalStorage,
  setInLocalStorage,
}
