const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/App.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts-loader']
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: '../assets', to: 'assets' }
    ])
  ]
};
