const path = require('path')
const fs = require('fs')

function addTsTsxToJsJsx(pattern) {
  return pattern
    .replace('js,jsx', 'ts,tsx,js,jsx')
    .replace('js|jsx', 'ts|tsx|js|jsx')
}

function rewireTypescriptJest(config, tsJestConfig) {
  const rootDir = path.resolve(fs.realpathSync(process.cwd()))

  config.collectCoverageFrom = config.collectCoverageFrom.map(addTsTsxToJsJsx)

  config.testMatch = config.testMatch.map(addTsTsxToJsJsx)

  config.transform = Object.assign(
    {},
    {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    config.transform
  )

  config.transformIgnorePatterns = config.transformIgnorePatterns.map(
    addTsTsxToJsJsx
  )

  config.moduleFileExtensions.push('ts', 'tsx', 'web.tsx', 'web.ts')

  if (tsJestConfig) {
    config.globals = {
      'ts-jest': Object.assign(
        {},
        {
          babelConfig: {
            presets: ['react-app']
          }
        },
        tsJestConfig
      )
    }
  }

  config.rootDir = rootDir

  // NOTE: could monkey patch src/setupTests.js to support .ts like rar-typescript does for index.js
  // but it seems less worthwhile. just run with .js, no need for module declaration stubs for eznyme etc

  return config
}

module.exports = rewireTypescriptJest
