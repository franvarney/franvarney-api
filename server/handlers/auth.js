const Boom = require('boom')
const Debug = require('debug')('handlers/auth')

const Config = require('../../config')

exports.validate = function (token, callback) {
  let {method, path} = this

  if (token === Config.authToken) {
    Debug(`${method.toUpperCase()} request to ${path} validated with token ${token}`)
    return callback(null, true, { token })
  } else {
    Debug(`${method.toUpperCase()} request to ${path} not validated with token ${token}`)
    return callback(Boom.unauthorized('Invalid token'), false, { token })
  }
}
