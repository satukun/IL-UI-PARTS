'use strict'
var webpack = require('webpack')
var mode = process.env.ENV_MODE || 'development';
module.exports = {
  entry: {
    sp: './client/index_sp.js',
    pc: './client/index_pc.js'
  },
  output: {
    filename: './bundle_[name].js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
//            { test: /\.js$/, loader: "webpack-strip?strip[]=console.log" },
      { test: /\.js$/, loader: 'babel-loader', exclude:/node_modules/ }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode)
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};