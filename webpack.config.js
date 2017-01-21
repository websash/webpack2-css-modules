const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const TARGET = process.env.npm_lifecycle_event

if (TARGET === 'start' || !TARGET) {
  module.exports = {
    entry: [
      './app/index.js'
    ],
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
      publicPath: '/'
    },
    devServer: {
      historyApiFallback: true,
      inline: true,
      stats: 'errors-only',
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT
    },
    module: {
      rules: [{
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: true,
            localIdentName: '[path][name]__[local]_[hash:base64:5]'
          }
        }],
        exclude: /node_modules|build|app\/styles/
      }]
    }
  }
}

if (TARGET === 'build') {
  module.exports = {
    entry: {
      app: './app/index.js',
      global: './app/styles/global.css'
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
      publicPath: '/'
    },
    module: {
      rules: [{
        test: /\.css$/,
        use: [
          ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader'
          }), {
            loader: 'css-loader',
            options: {
              minimize: true,
              modules: true,
              importLoaders: true,
              localIdentName: '[hash:6]'
            }
          }
        ],
        exclude: /node_modules|build|app\/styles/
      }, {
        test: /\.css$/,
        use: [ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader'
        }), {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }],
        include: /app\/styles/
      }]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      function () {
        this.plugin('done', function (stats) {
          const assets = stats.toJson().assetsByChunkName
          console.log('assets:\n======\n', assets)
        })
      }
    ]
  }
}
