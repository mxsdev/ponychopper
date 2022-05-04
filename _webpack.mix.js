const mix = require('laravel-mix')
const path = require('path')
const fs = require('fs')
const util = require('util')
const { DefinePlugin } = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')

const DIR_DIST = path.join(__dirname, 'dist')
const DIR_APP  = path.join(__dirname, 'app')

const ICON_NAME     = 'horse.png'
const ICON          = path.join(__dirname, ICON_NAME)

const DIST_DIR_UI     = 'ui'
const DIST_DIR_CSS    = path.join(DIST_DIR_UI, 'css')
const DIST_DIR_JS     = path.join(DIST_DIR_UI, 'js')
const DIST_DIR_HTML   = DIST_DIR_UI
const DIST_DIR_SCRIPT = 'script'
const DIST_DIR_ICON = ''

const DIST_INDEX_HTML    = path.join(DIST_DIR_HTML, 'index.html')
const DIST_CSS_MAIN      = path.join(DIST_DIR_CSS, 'main.css')
const DIST_REACT_MAIN    = path.join(DIST_DIR_JS, 'bundle.js')
const DIST_PRELOAD       = path.join(DIST_DIR_SCRIPT, 'preload.js')
const DIST_ELECTRON_MAIN = path.join('main.js')
const DIST_ICON          = path.join(DIST_DIR_ICON, ICON_NAME)

const ELECTRON_MAIN = path.join(DIR_APP, 'electron', 'main.ts')
const PRELOAD       = path.join(DIR_APP, 'electron', 'preload.ts')

const REACT_MAIN = path.join(DIR_APP, 'index.tsx')
const CSS_MAIN   = path.join(__dirname, 'css', 'main.css')
const HTML_MAIN = path.join(DIR_APP, 'index.html')

const dist = (p = '') => path.join(DIR_DIST, p)

mix.ts(REACT_MAIN, DIST_REACT_MAIN).react()
    .webpackConfig({
        output: {
            path: DIR_DIST
        },
        resolve: {
            plugins: [new (require('tsconfig-paths-webpack-plugin'))()]
        },
        plugins: [
            new HTMLWebpackPlugin({
                templateContent: util.format(
                    fs.readFileSync(HTML_MAIN).toString(), 
                    path.relative(DIST_DIR_HTML, DIST_CSS_MAIN),
                    path.relative(DIST_DIR_HTML, DIST_REACT_MAIN)
                ),
                filename: DIST_INDEX_HTML,
                inject: false,
            })
        ]
    })
    .postCss(CSS_MAIN, DIST_CSS_MAIN, [
        require("tailwindcss"),
        require("postcss-nested")
    ])
    .ts(PRELOAD, DIST_PRELOAD)
    .ts(ELECTRON_MAIN, DIST_ELECTRON_MAIN).webpackConfig({
        target: 'electron-main',
        plugins: [
            new DefinePlugin({
                DIST_INDEX_HTML: `"${DIST_INDEX_HTML}"`,
                DIST_PRELOAD: `"${DIST_PRELOAD}"`
            }),
        ]
    })
    .copy(ICON, dist(DIST_ICON))

mix.disableNotifications()