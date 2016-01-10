import {Server} from 'hapi'
import Logger from '@modulus/logger'
import Mongoose from 'mongoose'

import Auth from './handlers/auth'
import Config from '../config'
import CronJob from '../server/jobs'
import GithubActivity from '../server/jobs/github-activity'
import UpdateCache from '../server/jobs/update-cache'
import Plugins from './plugins'
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

server.register(Plugins, (err) => {
  if (err) {
    logger.error(`server.register error: ${err.message}`)
    throw err
  }
})

server.auth.strategy('simple', 'bearer-access-token', {
  allowQueryToken: true,
  allowMultipleHeaders: false,
  accessTokenName: 'auth_token',
  validateFunc: Auth.validate
})

server.auth.default({
  strategy: 'simple'
})

server.start((err) => {
  if (err) {
    logger.error(`server.start error: ${err.message}`)
    throw err
  }

  logger.info(`Server starting at ${server.info.uri}`)

  server.route(Routes)

  CronJob(GithubActivity, Config.jobs.frequency.githubActivity)
  CronJob(UpdateCache, Config.jobs.frequency.updateCache)
})

export default server
