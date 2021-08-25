let mix = require('laravel-mix')

mix.copy('src/www', 'extension-build/www')
mix.copy('src/manifest.json', 'extension-build')
mix.copy('src/icons', 'extension-build/icons')
mix.copy('src/sass/font-files', 'extension-build/css/font-files')

mix
  .setPublicPath('./')
  .sass('src/sass/inter.scss', 'extension-build/css')
  .sass('src/sass/linkedin.scss', 'extension-build/css')
  .sass('src/sass/twitter.scss', 'extension-build/css')
  .sass('src/sass/twitter-dim.scss', 'extension-build/css')
  .sass('src/sass/twitter-dark.scss', 'extension-build/css')
  .sass('src/sass/youtube.scss', 'extension-build/css')
  .sass('src/sass/youtube-dark.scss', 'extension-build/css')
  .sass('src/sass/popup.scss', 'extension-build/css')
  .ts('src/focus.ts', 'extension-build')
  .ts('src/background.ts', 'extension-build')
  .ts('src/ts/feed-card-controller.ts', 'extension-build/js')
  .vue()
  .ts('src/ts/popup-card-controller.ts', 'extension-build/js')
  .vue()
  .options({
    processCssUrls: false,
  })
