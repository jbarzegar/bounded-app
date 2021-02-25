const path = require('path')

module.exports = conf => {
  conf.resolve.modules = [
    ...conf.resolve.modules,
    path.resolve(__dirname, './src'),
  ]

  const oneOfRule = conf.module.rules.find(rule => rule.oneOf)
  if (oneOfRule) {
    const tsxRule = oneOfRule.oneOf.find(
      rule => rule.test && rule.test.toString().includes('tsx')
    )

    const newIncludePaths = [
      // relative path to my yarn workspace library
      path.resolve(__dirname, '../core'),
    ]
    if (tsxRule) {
      if (Array.isArray(tsxRule.include)) {
        tsxRule.include = [...tsxRule.include, ...newIncludePaths]
      } else {
        tsxRule.include = [tsxRule.include, ...newIncludePaths]
      }
    }
  }
  return conf
}
