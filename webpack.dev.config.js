const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./webpack.config');

module.exports = {
  ...config,
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: path.join(__dirname, 'client/react')
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    }),
    new CopyWebpackPlugin([{ from: './client/assets', to: 'assets' }])
  ]
};
