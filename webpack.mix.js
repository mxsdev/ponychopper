const mix = require('laravel-mix')

mix.ts('./app/index.tsx', './public/js').react()
    .webpackConfig({
        resolve: {
            plugins: [new (require('tsconfig-paths-webpack-plugin'))()]
        }
    })
    .postCss('./css/main.css', './public/css', [
        require("tailwindcss"),
        require("postcss-nested")
    ])
    
mix.ts('./app/electron/desktop.ts', './').webpackConfig({
    target: 'electron-main'
})

mix.browserSync({
    server: "public"
})

mix.disableSuccessNotifications()