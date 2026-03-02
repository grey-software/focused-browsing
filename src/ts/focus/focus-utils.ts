import { browser } from 'webextension-polyfill-ts'

// Legacy helper — not currently called by any code path. Retained as an export
// to avoid breaking the module's public interface.
const isURLValid = (url: string) => {
  return (
    url.includes('linkedin.com') ||
    url.includes('youtube.com')
  )
}

async function getFromLocalStorage(name: string) {
  let storeObject = await browser.storage.local.get(name)
  return storeObject[name]
}

function setInLocalStorage(storageName: string, storageObj: any): Promise<void> {
  const obj: any = {}
  obj[storageName] = storageObj
  return browser.storage.local.set(obj)
}

export default {
  isURLValid,
  getFromLocalStorage,
  setInLocalStorage,
}
