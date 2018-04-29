const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./webpack.config');

module.exports = {
  ...config,
  mode: 'development',
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    }),
    new CopyWebpackPlugin([
      { from: './client/assets', to: 'assets' }
    ])
  ]
};
