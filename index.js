const fs = require('fs')
const path = require('path')
const { getLoader, getBabelLoader } = require('react-app-rewired')

/**
 * @param {object} config
 * @param {object} config.resolve
 * @param {string[]} config.resolve.extensions
 * @param {object} config.module
 * @param {any[]} config.module.rules
 * @param {string[]} config.entry
 */
function rewireTypescript(config, env, typescriptLoaderOptions = {}) {
  // Monkey patch react-scripts paths to use just `src` instead of
  // `src/index.js` specifically. Hopefully this can get removed at some point.
  // @see https://github.com/facebookincubator/create-react-app/issues/3052
  let paths = require('react-scripts/config/paths')
  if (paths) {
    paths.appIndexJs = path.resolve(fs.realpathSync(process.cwd()), 'src')
  }

  // Add Typescript files to automatic file resolution for Webpack.
  config.resolve.extensions = (config.resolve.extensions || []).concat([
    '.web.ts',
    '.ts',
    '.tsx'
  ])

  // Add Typescript as an exception to the file-loader defaults.
  const fileLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.endsWith(`file-loader${path.sep}index.js`)
  )
  fileLoader.exclude.push(/\.tsx?$/)

  // Add Typescript to the loader rules, using a copy of the existing Babel
  // configs.
  const babelLoader = getBabelLoader(config.module.rules)
  const typescriptRules = {
    test: /\.tsx?$/,
    use: [
      { loader: babelLoader.loader, options: babelLoader.options },
      { loader: 'ts-loader', options: typescriptLoaderOptions }
    ]
  }
  config.module.rules.push(typescriptRules)

  // Change the hardcoded `index.js` to just `index`, so that it will resolve as
  // whichever file is available. The use of `fs` is to handle things like
  // symlinks.
  config.entry = config.entry
    .slice(0, config.entry.length - 1)
    .concat([path.resolve(fs.realpathSync(process.cwd()), 'src/index')])

  return config
}

module.exports = rewireTypescript
