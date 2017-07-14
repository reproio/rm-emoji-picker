/**
 * Created by dondoco7 on 7/14/17.
 */
const webpack = require('webpack');

module.exports = {
  entry: {
    demo: './examples/src/demo.js'
  },
  cache: true,
  output: {
    path: __dirname + '/examples/build/',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  devtool  : '#inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?presets[]=es2015'
      },
      {
        test: /\.mustache$/,
        loader: 'mustache?minify'
      }
    ]
  }
}
