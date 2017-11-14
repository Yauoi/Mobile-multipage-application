'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')

const path = require('path')
const array = require('lodash/array')
const pagesPath = path.resolve(__dirname, '../src/pages')

const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
// })

module.exports = function (compilePages) {
  var allPages = utils.getPages(pagesPath)
  var allPagesKeys = Object.keys(allPages)
  var compilePagesKeys = []
  var htmlPlugins = []

  if (compilePages && compilePages.length > 0) {
    var compilePagesKeys = array.remove(allPagesKeys, function (item) {
      return (compilePages.join(',') + ',').indexOf(item + ',') !== -1
    })
  } else {
    compilePagesKeys = allPagesKeys
  }
  baseWebpackConfig.entry = {}
  compilePagesKeys.forEach(function (page) {
    baseWebpackConfig.entry[page] = allPages[page]
    htmlPlugins.push(new HtmlWebpackPlugin({
      filename: page + '.html',
      template: 'src/pages/' + page + '/index.html',
      inject: true,
      chunks: [page],
      chunksSortMode: 'dependency'
    }))
  })

  // add hot-reload related code to entry chunks
  Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
  })

  return merge(baseWebpackConfig, {
    module: {
      loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': config.dev.env
      }),
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new FriendlyErrorsPlugin()
    ].concat(htmlPlugins)
  })
}
