let mix = require("laravel-mix")

mix.copy('src/www', 'extension-build/www')
mix.copy('src/manifest.json', 'extension-build')
mix.copy('src/logo.png','extension-build')
mix.copy('src/logox16.png','extension-build')
mix.copy('src/logox48.png','extension-build')
mix.copy('src/logox128.png','extension-build')

mix.setPublicPath('./')
    .sass('src/sass/twitter.scss', 'extension-build/css')
    .sass('src/sass/twitter-dim.scss','extension-build/css')
    .sass('src/sass/twitter-dark.scss', 'extension-build/css')
    .js('src/js/background.js', 'extension-build/js')
    .js('src/js/content.js', 'extension-build/js')
    .js('src/js/Twitter/TwitterController.js', 'extension-build/js/Twitter')
    .js('src/js/feed-card-controller.js', 'extension-build/js').vue()
    .options({
        processCssUrls: false
    })