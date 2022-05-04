const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const fs = require('fs')
const util = require('util')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')

const DIR_DIST = path.join(__dirname, 'dist')
const DIR_APP  = path.join(__dirname, 'app')
const DIR_CSS = path.join(DIR_APP, 'css')

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
const CSS_MAIN   = path.join(DIR_CSS, 'main.css')
const HTML_MAIN = path.join(DIR_APP, 'index.html')

/** @type {import("webpack").Configuration} */
module.exports = [
    /** ELECTRON MAIN */
    {
        mode: 'development',
        entry: ELECTRON_MAIN,
        target: 'electron-main',
        resolve: {
            extensions: [ '.ts', '.js' ],
            plugins: [
                new TsconfigPathsPlugin()
            ]
        },
        plugins: [
            new DefinePlugin({
                DIST_INDEX_HTML: `"${DIST_INDEX_HTML}"`,
                DIST_PRELOAD: `"${DIST_PRELOAD}"`
            }),
        ],
        module: {
            rules: [{
                test: /\.ts$/,
                include: DIR_APP,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        output: {
            path: DIR_DIST,
            filename: DIST_ELECTRON_MAIN
        }
    },
    {
        mode: 'development',
        entry: REACT_MAIN,
        target: ['web', 'electron-renderer'],
        resolve: {
            extensions: [ '.tsx', '.jsx', '.ts', '.js', '.css' ],
            plugins: [
                new TsconfigPathsPlugin()
            ]
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: DIR_APP,
                    use: [{ loader: 'ts-loader' }]
                },
                {
                    test: /\.css$/i,
                    include: DIR_CSS,
                    use: ['style-loader', 'css-loader', 'postcss-loader']
                }
            ]
        },
        plugins: [
            new HTMLWebpackPlugin({
                templateContent: util.format(
                    fs.readFileSync(HTML_MAIN).toString(), 
                    path.relative(DIST_DIR_HTML, DIST_REACT_MAIN)
                ),
                filename: DIST_INDEX_HTML,
                inject: false,
            })
        ],
        output: {
            path: DIR_DIST,
            filename: DIST_REACT_MAIN
        }
    },
    {
        mode: 'development',
        entry: PRELOAD,
        target: 'electron-preload',
        resolve: {
            extensions: [ '.ts', '.js' ],
            plugins: [
                new TsconfigPathsPlugin()
            ]
        },
        module: {
            rules: [{
                test: /\.ts$/,
                include: DIR_APP,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        output: {
            path: DIR_DIST,
            filename: DIST_PRELOAD
        }
    }
]