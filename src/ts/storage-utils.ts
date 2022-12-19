import { browser } from 'webextension-polyfill-ts'

async function getFromLocalStorage(name: string) {
  let storeObject = await browser.storage.local.get(name)
  return storeObject[name]
}

function setInLocalStorage(storageName: string, storageObj: any) {
  var obj: any = {}
  obj[storageName] = storageObj
  browser.storage.local.set(obj)
}

export { getFromLocalStorage, setInLocalStorage }
