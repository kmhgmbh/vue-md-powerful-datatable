var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var utils = require('./utils');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
})

module.exports = merge(baseWebpackConfig, {
  entry: {
    app: './src/dev.js'
  },
  devtool: '#eval-source-map',
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: true,
      extract: true
    })
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': "'development'"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
});
