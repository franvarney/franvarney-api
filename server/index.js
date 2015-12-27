import {Server} from 'hapi'
import Logger from '@modulus/logger'

import Config from '../config'

let logger = Logger('server/index')
let server = new Server()

server.connection({
  host: Config.env !== 'production' ? Config.host : null,
  port: parseInt(Config.port, 10)
})

server.start((err) => {
  if (err) {
    logger.error(`server.start error: ${err.message}`)
    throw err
  }

  logger.info(`Server starting at ${server.info.uri}`)
})

export default server
