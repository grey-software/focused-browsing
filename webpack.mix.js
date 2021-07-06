let mix = require("laravel-mix")

mix.copy('src/www', 'extension-build/www')
mix.copy('src/manifest.json', 'extension-build')
mix.copy('src/icons','extension-build/icons')


mix.setPublicPath('./')
    .sass('src/sass/linkedin.scss', 'extension-build/css')
    .sass('src/sass/twitter.scss', 'extension-build/css')
    .sass('src/sass/twitter-dim.scss','extension-build/css')
    .sass('src/sass/twitter-dark.scss', 'extension-build/css')
    .sass('src/sass/popup.scss', 'extension-build/css')
    .js('src/background.js', 'extension-build')
    .js('src/js/LinkedIn/LinkedInController.js', 'extension-build/js/LinkedIn')
    .js('src/focus.js', 'extension-build')
    .js('src/js/Twitter/TwitterController.js', 'extension-build/js/Twitter')
    .js('src/js/feed-card-controller.js', 'extension-build/js').vue()
    .js('src/js/popup-card-controller.js', 'extension-build/js').vue()
    .options({
        processCssUrls: false
    })