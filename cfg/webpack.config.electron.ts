import path from 'path'
import fs from 'fs'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import util from 'util'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import webpack, { DefinePlugin } from 'webpack'
import { PROJECT_PATHS } from './webpack.config.paths'
import { IS_DEVELOPER, WEBPACK_MODE } from './webpack.config.env'


const { ELECTRON_MAIN, DIST_INDEX_HTML, DIST_PRELOAD, DIR_APP, DIR_DIST, DIST_ELECTRON_MAIN, REACT_MAIN, DIR_CSS, HTML_MAIN, DIST_DIR_HTML, DIST_REACT_MAIN, PRELOAD } = PROJECT_PATHS

const WATCH_OPTS: webpack.Configuration['watchOptions'] = {
    ignored: ['**/node_modules'],
}

const CFG_ELECTRON_MAIN: webpack.Configuration = {
    mode: WEBPACK_MODE,
    entry: ELECTRON_MAIN,
    target: 'electron-main',
    resolve: {
        extensions: [ '.ts', '.js' ],
        plugins: [
            new TsconfigPathsPlugin()
        ]
    },
    stats: 'minimal',
    plugins: [
        new DefinePlugin({
            DIST_INDEX_HTML: `"${DIST_INDEX_HTML}"`,
            DIST_PRELOAD: `"${DIST_PRELOAD}"`,
            DEV_MODE: IS_DEVELOPER
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: DIR_APP,
                exclude: /node_modules/,
                use: [{ loader: 'ts-loader' }]
            },
        ]
    },
    output: {
        path: DIR_DIST,
        filename: DIST_ELECTRON_MAIN
    },
    watchOptions: WATCH_OPTS
}

const CFG_ELECTRON_PRELOAD: webpack.Configuration = {
    mode: WEBPACK_MODE,
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
            exclude: /node_modules/,
            use: [{ loader: 'ts-loader' }]
        }]
    },
    output: {
        path: DIR_DIST,
        filename: DIST_PRELOAD
    },
    stats: 'minimal',
    watchOptions: WATCH_OPTS
}

/** @type {import("webpack").Configuration} */
module.exports = [
    CFG_ELECTRON_MAIN,
    CFG_ELECTRON_PRELOAD,
]