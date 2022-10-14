// // /// <reference types="cypress" />
// // // ***********************************************************
// // // This example plugins/index.js can be used to load plugins
// // //
// // // You can change the location of this file or turn off loading
// // // the plugins file with the 'pluginsFile' configuration option.
// // //
// // // You can read more here:
// // // https://on.cypress.io/plugins-guide
// // // ***********************************************************

// // // This function is called when a project is opened or re-opened (e.g. due to
// // // the project's config changing)

// // /**
// //  * @type {Cypress.PluginConfig}
// //  */
// // // eslint-disable-next-line no-unused-vars
// import path = require('path')
// import fs = require('fs')

// const extensionPath = path.join(__dirname, '../../extension-build')
// // const manifestPath = path.join(extensionPath, 'src/manifest.json')
// // const manifestData = fs.readFileSync(manifestPath)
// // const manifestJson = JSON.parse(manifestData)

// import webpack = require('@cypress/webpack-preprocessor')

// module.exports = (on, config: any): void => {
//   on('before:browser:launch', (browser: any, launchOptions: { extensions: string[] }) => {
//     on('file:preprocessor', webpack())
//     // supply the absolute path to an unpacked extension's folder
//     // NOTE: extensions cannot be loaded in headless Chrome
//     console.log('launching browser %o', browser)

//     console.log('loading extension with this path: ' + extensionPath)
//     launchOptions.extensions.push(extensionPath)

//     return launchOptions
//   })
// }
