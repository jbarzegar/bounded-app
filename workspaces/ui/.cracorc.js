const webpackOverride = require('./weback-override')
module.exports = {
  webpack: {
    configure: webpackOverride,
  },
}
