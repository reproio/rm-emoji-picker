/**
 * Created by dondoco7 on 7/14/17.
 */
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    EmojiPicker: './src/js/EmojiPicker.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
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
  },
  externals: {
    "jquery" : "jquery"
  },
  plugins: [
    //The uglify plugin is used to minify and obfuscate the source code
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
