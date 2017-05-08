const Debug = require('debug')('helpers/is-authorized')

const Config = require('../../config')

module.exports = function (auth) {
  Debug('is-authorized')
  return auth.credentials && (auth.credentials &&
         auth.credentials.token === Config.authToken)
}
