import {unauthorized} from 'boom'
import Logger from '@modulus/logger'

import Config from '../../config'

let logger = Logger('handlers/auth')

function validate(token, callback) {
  let request = this

  if (token === Config.authToken) {
    logger.info(`${request.method.toUpperCase()} request to ${request.path} validated with token ${token}`)
    callback(null, true, { token: token })
  } else {
    logger.error(`${request.method.toUpperCase()} request to ${request.path} not validated with token ${token}`)
    callback(unauthorized('Invalid token'), false, { token: token })
  }
}

export default {
  validate: validate
}
