import { defineConfig } from 'cypress'
import * as path from 'path'

const extensionPath = path.join(__dirname, '../extension-build')

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        // supply the absolute path to an unpacked extension's folder
        // NOTE: extensions cannot be loaded in headless Chrome
        // console.log(extensionPath)
        // launchOptions.extensions.push(extensionPath)
        return launchOptions
      })
    },
  },
})
