// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack')

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
    fs: false,
    path: false,
    vm: false,
  })
  config.devServer = {
    historyApiFallback: true,
  }
  config.resolve.fallback = fallback
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, '')
      switch (mod) {
        case 'util':
          resource.request = 'util'
          break
        case 'http':
          resource.request = 'stream-http'
          break
        case 'https':
          resource.request = 'https-browserify'
          break
        case 'url':
          resource.request = 'url'
          break
        case 'fs':
          resource.request = 'fs'
          break
        case 'stream':
          resource.request = 'readable-stream'
          break
        case 'net':
          resource.request = 'net'
          break
        case 'path':
          resource.request = 'path'
          break
        case 'zlib':
          resource.request = 'browserify-zlib'
          break
        case 'buffer':
          resource.request = 'buffer'
          break
        default:
          throw new Error(`Not found ${mod}`)
      }
    }),
  ])
  config.ignoreWarnings = [/Failed to parse source map/]
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: 'pre',
    loader: require.resolve('source-map-loader'),
    resolve: {
      fullySpecified: false,
    },
  })
  return config
}
