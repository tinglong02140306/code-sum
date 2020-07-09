'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})
let devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: false })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(), //热更新
        new webpack.NamedModulesPlugin(), // 更新组件时在控制台输出组件的路径
        new webpack.NoEmitOnErrorsPlugin(), // 跳过输出
        new ExtractTextPlugin({
            filename: utils.assetsPath('styles/[name].[contenthash].css'),
            allChunks: false,
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../', 'mock'),
            to: path.resolve(__dirname, '../', 'dist/mock')
        }])
    ]
})

//添加webpack html plugin
devWebpackConfig = utils.addHTMLPlugin(devWebpackConfig)

module.exports = devWebpackConfig;
