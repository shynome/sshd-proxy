// @ts-check
require('./next.preset')

const path = require('path')
const alias = require('./tsconfig.alias').alias

module.exports = {
  poweredByHeader: false,
  pageExtensions: ['page.tsx', 'api.ts'],
  webpack: (config, options) => {
    for (let name in alias) {
      let dir = alias[name]
      config.resolve.alias[name] = path.join(__dirname, dir)
    }

    config.plugins = config.plugins || []
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [{ loader: 'graphql-tag/loader' }],
    })

    return config
  },
}
