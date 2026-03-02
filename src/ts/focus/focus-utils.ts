import { browser } from 'webextension-polyfill-ts'

// Legacy allowlist — twitter.com and github.com are not supported by any
// controller and not in manifest host_permissions. Kept for reference only.
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

// Fire-and-forget: the storage.local.set Promise is not awaited.
// Callers that need write confirmation should use browser.storage.local.set directly.
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
