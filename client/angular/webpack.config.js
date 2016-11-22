var path = require('path');

module.exports = {
  entry: './app/app.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['ng-annotate', 'babel'] },
      { test: /\.html$/, loader: 'raw' },
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
};
