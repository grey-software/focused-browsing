let mix = require("laravel-mix")

var path = require('path')

mix.setPublicPath('./')
    .sass('src/sass/twitter.scss', 'dist/css')
    .sass('src/sass/twitter-dim.scss','dist/css')
    .sass('src/sass/twitter-dark.scss', 'dist/css')
    .js('src/js/background.js', 'dist/js')
    .js('src/js/content.js', 'dist/js')
    .js('src/js/siteStrategy/Twitter/TwitterStrategy.js', 'dist/js/siteStrategy/Twitter')
    .js('src/js/renderCards/feed.js', 'dist/js/renderCards/twitter').vue()
    .options({
        processCssUrls: false
    })