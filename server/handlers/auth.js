import {unauthorized} from 'boom'
import Logger from '@modulus/logger'

import Config from '../../config'

let logger = Logger('handlers/auth')

function validate(token, callback) {
  if (token === Config.authToken) {
    logger.info(`Request validated with token ${token}`)
    callback(null, true, { token: token })
  } else {
    logger.error(`Request not validated with token ${token}`)
    callback(unauthorized('Invalid token'), false, { token: token })
  }
}

export default {
  validate: validate
}
