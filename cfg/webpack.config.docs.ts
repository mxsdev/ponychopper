import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { WEBPACK_MODE, IS_DEVELOPER, DO_HMR, TS_TRANSPILE_ONLY, VERSION, REPOSITORY_URL } from './webpack.config.env'
import { PROJECT_PATHS } from './webpack.config.paths'
import webpack, { DefinePlugin } from 'webpack'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import fs from 'fs'
import path from 'path'
import util from 'util'
import 'webpack-dev-server'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ReactRefreshTypeScript from 'react-refresh-typescript'

const { REACT_DOCS, DIR_APP, DIR_DOCS, DIR_CSS, HTML_DOCS, DIR_DIST_DOCS, DIST_DOCS_REACT_MAIN, DIST_DOCS_INDEX_HTML } = PROJECT_PATHS

const CFG_REACT_MAIN: webpack.Configuration = {
    mode: WEBPACK_MODE,
    entry: REACT_DOCS,
    devtool: 'eval-source-map',
    target: ['web', 'electron-renderer'],
    resolve: {
        extensions: [ '.tsx', '.jsx', '.ts', '.js', '.css' ],
        plugins: [
            new TsconfigPathsPlugin()
        ],
        fallback: {
            path: require.resolve('path-browserify'),
        }
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: [
                    DIR_APP,
                    DIR_DOCS,
                ],
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
                fs.readFileSync(HTML_DOCS).toString(), 
                DIST_DOCS_REACT_MAIN,
            ),
            filename: DIST_DOCS_INDEX_HTML,
            inject: false,
        }),
        new DefinePlugin({
            APP_VERSION: `"${VERSION}"`,
            APP_REPOSITORY_URL: `"${REPOSITORY_URL}"`
        })
    ],
    stats: 'minimal',
    output: {
        path: DIR_DIST_DOCS,
        // publicPath: DIST_PUBLIC,
        filename: DIST_DOCS_REACT_MAIN
    },
    devServer: {
        hot: true,
    }
}

/** @type {import("webpack").Configuration} */
module.exports = CFG_REACT_MAIN