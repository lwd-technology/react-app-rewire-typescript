const path = require('path')
const { getLoader, getBabelLoader } = require('react-app-rewired')

function rewireTypescript(config, env, typescriptLoaderOptions = {}) {
  config.resolve.extensions = (config.resolve.extensions || []).concat([
    '.web.ts',
    '.ts',
    '.tsx'
  ])

  const typescriptExtension = /\.tsx?$/

  const fileLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.endsWith(`file-loader${path.sep}index.js`)
  )
  fileLoader.exclude.push(typescriptExtension)

  const babelRules = getBabelLoader(config.module.rules)

  const typescriptRules = {
    test: typescriptExtension,
    use: [
      ...babelRules.use,
      { loader: 'ts-loader', options: typescriptLoaderOptions }
    ]
  }

  config.module.rules.push(typescriptRules)

  return config
}

module.exports = rewireTypescript
