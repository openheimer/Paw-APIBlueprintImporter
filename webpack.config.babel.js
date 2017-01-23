var webpack = require('webpack');

module.exports = {
  target: 'node-webkit',
  entry: [
    './src/APIBlueprintImporter.js',
  ],
  output: {
    filename: 'APIBlueprintImporter.js',
    path: './build/io.apiary.PawExtensions.APIBlueprintImporter'
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      {
        loader: 'coffee-loader',
        test: /\.coffee$/,
        exclude: /node_modules/,
      },
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      }
    ]
  }
}
