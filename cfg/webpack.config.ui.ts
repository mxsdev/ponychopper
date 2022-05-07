import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { WEBPACK_MODE, IS_DEVELOPER, DO_HMR, TS_TRANSPILE_ONLY } from './webpack.config.env'
import { PROJECT_PATHS } from './webpack.config.paths'
import webpack from 'webpack'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import fs from 'fs'
import path from 'path'
import util from 'util'
import 'webpack-dev-server'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ReactRefreshTypeScript from 'react-refresh-typescript'
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
// const ReactRefreshTypeScript = require('react-refresh-typescript')

const { ELECTRON_MAIN, DIST_INDEX_HTML, DIST_PRELOAD, DIR_APP, DIR_DIST, DIST_ELECTRON_MAIN, REACT_MAIN, DIR_CSS, HTML_MAIN, DIST_DIR_HTML, DIST_REACT_MAIN, PRELOAD, DIST_PUBLIC } = PROJECT_PATHS

const CFG_REACT_MAIN: webpack.Configuration = {
    mode: WEBPACK_MODE,
    entry: REACT_MAIN,
    devtool: 'eval-source-map',
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
                use: [{ 
                    loader: 'ts-loader',
                    options: {
                        getCustomTransformers: () => ({
                            before: [
                                ...(DO_HMR ? [ReactRefreshTypeScript()] : [])
                            ],
                        }),
                        transpileOnly: TS_TRANSPILE_ONLY,
                      },
                 }]
            },
            {
                test: /\.css$/i,
                include: DIR_CSS,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    plugins: [
        ...(DO_HMR ? [new ReactRefreshWebpackPlugin()]: []),
        new HTMLWebpackPlugin({
            templateContent: util.format(
                fs.readFileSync(HTML_MAIN).toString(), 
                path.relative(DIST_DIR_HTML, DIST_REACT_MAIN)
            ),
            filename: DIST_INDEX_HTML,
            inject: false,
        }),
    ],
    stats: 'minimal',
    output: {
        path: DIR_DIST,
        // publicPath: DIST_PUBLIC,
        filename: DIST_REACT_MAIN
    },
    devServer: {
        hot: true,
    }
}

/** @type {import("webpack").Configuration} */
module.exports = CFG_REACT_MAIN