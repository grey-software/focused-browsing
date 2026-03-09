import { browser } from 'webextension-polyfill-ts'

export async function getFromLocalStorage(name: string) {
  const storeObject = await browser.storage.local.get(name)
  return storeObject[name]
}

export function setInLocalStorage(storageName: string, storageObj: any): Promise<void> {
  const obj: any = {}
  obj[storageName] = storageObj
  return browser.storage.local.set(obj)
}