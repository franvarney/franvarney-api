import {Server} from 'hapi'
import Logger from '@modulus/logger'
import Mongoose from 'mongoose'

import Config from '../config'
import Routes from './routes'

let logger = Logger('server/index')
let server = new Server()

Mongoose.connect(Config.mongo.url, (err) => {
  if (err) {
    logger.error(`Mongoose.connect error: ${err.message}`)
    throw err
  }

  logger.info(`Connected to ${Config.mongo.url}`)
})

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

  server.route(Routes)
})

export default server
