/**
 * Created by dondoco7 on 7/14/17.
 */
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    demo: './examples/src/demo.js'
  },
  output: {
    path: path.resolve(__dirname, './examples/build/'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  devtool  : '#inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015'
      },
      {
        test: /\.mustache$/,
        loader: 'mustache-loader?minify'
      }
    ]
  }
};
