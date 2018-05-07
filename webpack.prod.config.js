const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('./webpack.config');

module.exports = {
  ...config,
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: path.join(__dirname, 'client/react')
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyWebpackPlugin([
      { from: './client/assets', to: 'assets' }
    ])
  ]
};
