var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

module.exports = {
  entry: {
    friday: './example/friday.js',
    refresh: './example/refresh.js'
  },
  output: {
    path: 'example/resources',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.png$/, loader: 'url-loader?mimetype=image/png'},
      {test: /\.json$/, loader: 'json' },
      {test: /\.html$/, loader: 'html'}
    ]
  },
  plugins: [
    new CommonsChunkPlugin('commons.chunk.js')
  ]
}
