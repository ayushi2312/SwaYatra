const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev && config.output?.path) {
      const out = path.normalize(config.output.path)
      const isServerChunksOut =
        out.endsWith(`${path.sep}server${path.sep}chunks`) ||
        out.endsWith('/server/chunks')
      if (isServerChunksOut && config.output.chunkFilename === '[name].js') {
        // Fixes server bundle chunk loading for Next 14.2 / webpack 5 (missing ./<id>.js).
        config.output.chunkFilename = '../[name].js'
      }
    }
    return config
  },
}

module.exports = nextConfig

