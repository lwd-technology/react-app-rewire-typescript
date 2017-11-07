const fs = require('fs')
const path = require('path')
const { getBabelLoader } = require('react-app-rewired')

/**
 * @param {Object} rule
 * @return {Array}
 */
const ruleChildren = rule =>
  rule.use || rule.oneOf || (Array.isArray(rule.loader) && rule.loader) || []

const findIndexAndRules = (rulesSource, ruleMatcher) => {
  let result
  const rules = Array.isArray(rulesSource)
    ? rulesSource
    : ruleChildren(rulesSource)
  rules.some(
    (rule, index) =>
      (result = ruleMatcher(rule)
        ? { index, rules }
        : findIndexAndRules(ruleChildren(rule), ruleMatcher))
  )
  return result
}

/**
 * Given a rule, return if it uses a specific loader.
 */
const createLoaderMatcher = loader => rule =>
  rule.loader && rule.loader.indexOf(`${path.sep}${loader}${path.sep}`) !== -1

/**
 * Get the existing file-loader config.
 */
const fileLoaderMatcher = createLoaderMatcher('file-loader')

/**
 * Add one rule before another in the list of rules.
 */
const addBeforeRule = (rulesSource, ruleMatcher, value) => {
  const { index, rules } = findIndexAndRules(rulesSource, ruleMatcher)
  rules.splice(index, 0, value)
}

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

  // Change the hardcoded `index.js` to just `index`, so that it will resolve as
  // whichever file is available. The use of `fs` is to handle things like
  // symlinks.
  config.entry = config.entry
    .slice(0, config.entry.length - 1)
    .concat([path.resolve(fs.realpathSync(process.cwd()), 'src/index')])

  // Add Typescript files to automatic file resolution for Webpack.
  config.resolve.extensions = (config.resolve.extensions || []).concat([
    '.web.ts',
    '.ts',
    '.tsx'
  ])

  // Set up a Typescript rule.
  const babelLoader = getBabelLoader(config.module.rules)
  const typescriptRules = {
    test: /\.tsx?$/,
    use: [
      { loader: babelLoader.loader, options: babelLoader.options },
      { loader: 'ts-loader', options: typescriptLoaderOptions }
    ]
  }

  // Add the Typescript rule before the file-loader rule.
  addBeforeRule(config.module.rules, fileLoaderMatcher, typescriptRules)

  return config
}

module.exports = rewireTypescript
