import { browser } from 'webextension-polyfill-ts'

const isURLValid = (url: string) => {
  return url.includes('twitter.com') || url.includes('linkedin.com') || url.includes('youtube.com')
}

async function getFromLocalStorage(name: string) {
  let storeObject = await browser.storage.local.get(name)
  return storeObject[name]
}

export default {
  isURLValid,
  getFromLocalStorage,
}
