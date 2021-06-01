let mix = require("laravel-mix")

var path = require('path')
mix.copy('src/www', 'dist/www')
mix.copy('src/manifest.json', 'dist')

mix.setPublicPath('./')
    .sass('src/sass/twitter.scss', 'dist/css')
    .sass('src/sass/twitter-dim.scss','dist/css')
    .sass('src/sass/twitter-dark.scss', 'dist/css')
    .js('src/js/background.js', 'dist/js')
    .js('src/js/content.js', 'dist/js')
    .js('src/js/Twitter/TwitterController.js', 'dist/js/Twitter')
    .js('src/js/feed-card-controller.js', 'dist/js').vue()
    .options({
        processCssUrls: false
    })