const Boom = require('boom')
const Logger = require('@modulus/logger')('handlers/auth')

const Config = require('../../config')

exports.validate = function (token, callback) {
  let request = this

  if (token === Config.authToken) {
    Logger.info(`${request.method.toUpperCase()} request to ${request.path} validated with token ${token}`)
    return callback(null, true, { token: token })
  } else {
    Logger.error(`${request.method.toUpperCase()} request to ${request.path} not validated with token ${token}`)
    return callback(Boom.unauthorized('Invalid token'), false, { token })
  }
}
