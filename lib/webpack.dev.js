const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const webpackBase = require('./webpack.base');

module.exports = merge(webpackBase, {
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 9001,
    index: 'index.html',
    stats: 'errors-only',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
