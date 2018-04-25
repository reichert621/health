const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config');

module.exports = {
  ...config,
  mode: 'production',
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyWebpackPlugin([
      { from: './client/assets', to: 'assets' }
    ])
  ]
};
