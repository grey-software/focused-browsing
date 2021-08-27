let mix = require('laravel-mix')

mix.copy('src/www', 'extension-build/www')
mix.copy('src/manifest.json', 'extension-build')
mix.copy('src/icons', 'extension-build/icons')
mix.copy('src/styles/font-files', 'extension-build/css/font-files')

mix
  .setPublicPath('./')
  .sass('src/styles/inter.scss', 'extension-build/css')
  .sass('src/styles/linkedin.scss', 'extension-build/css')
  .sass('src/styles/twitter.scss', 'extension-build/css')
  .sass('src/styles/twitter-dim.scss', 'extension-build/css')
  .sass('src/styles/twitter-dark.scss', 'extension-build/css')
  .sass('src/styles/youtube.scss', 'extension-build/css')
  .sass('src/styles/youtube-dark.scss', 'extension-build/css')
  .sass('src/styles/popup.scss', 'extension-build/css')
  .ts('src/focus.ts', 'extension-build')
  .ts('src/background.ts', 'extension-build')
  .ts('src/ts/feed-card-controller.ts', 'extension-build/js')
  .vue()
  .ts('src/ts/popup-card-controller.ts', 'extension-build/js')
  .vue()
  .options({
    processCssUrls: false,
  })
