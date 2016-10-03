const Logger = require('franston')('helpers/is-authorized')

const Config = require('../../config')

module.exports = function (auth) {
  Logger.debug('is-authorized')
  return auth.credentials && (auth.credentials &&
         auth.credentials.token === Config.authToken)
}
