var path = require('path');
var projectRoot = path.resolve(__dirname, '../');
var utils = require('./utils');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.Vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      '@': path.resolve(__dirname, '../src'),
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  module: {
    preLoaders: [{
      test: /\.vue$/,
      loader: 'eslint',
      include: projectRoot,
      exclude: /node_modules/
    }, {
      test: /\.js$/,
      loader: 'eslint',
      include: projectRoot,
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.vue$/,
      loader: 'vue',
      options: {
        loaders: {
          scss: 'sass-loader',
        }
      }
    }, {
      test: /\.js$/,
      loader: 'babel',
      include: projectRoot,
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    ]
  }
}
