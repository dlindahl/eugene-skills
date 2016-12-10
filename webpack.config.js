const path = require('path')
const webpack = require('webpack')

// NOTE: paths are relative to each functions folder
module.exports = {
  entry: './src/index.js',
  module: {
    loaders: [
      {
        loader: path.join(__dirname, './alexa-schema-loader'),
        test: /model\/intents\.js$/
      },
      {
        /*
        Needed to enable block scoping in external modules.
        Babel does this automatically but its too slow to run on all the
        NPM modules.
        */
        loader: 'strict',
        test: /node_modules\/.+\.js$/
      },
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        test: /\.js$/
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      }
    ]
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: './build'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true)
  ],
  target: 'node'
}
