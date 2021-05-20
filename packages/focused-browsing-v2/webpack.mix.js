let mix = require("laravel-mix")

mix.setPublicPath('./')
    .sass('src/sass/card.scss', 'dist/css')
    .js('src/js/background.js', 'dist/js')
    .js('src/js/content.js', 'dist/js')
    .js('src/js/focusCard.js', 'dist/js').vue()
    .options({
        processCssUrls: false
    })