const Hapi = require('hapi')
const Logger = require('@modulus/logger')('server/index')
const Mongoose = require('mongoose')

const Auth = require('./handlers/auth')
const Config = require('../config')
const CronJob = require('../server/jobs')
const GithubActivity = require('../server/jobs/get-github-activity')
const Plugins = require('./plugins')
const Routes = require('./routes')
const UpdateCache = require('../server/jobs/update-activity-cache')

let server = new Hapi.Server()

Mongoose.connect(Config.mongo.url, (err) => {
  if (err) {
    Logger.error(`Mongoose.connect error: ${err.message}`)
    throw err
  }

  Logger.info(`Connected to ${Config.mongo.url}`)
})

server.connection({
  host: Config.env !== 'production' ? Config.host : null,
  port: parseInt(Config.port, 10),
  routes: { cors: true }
})

server.register(Plugins, (err) => {
  if (err) {
    Logger.error(`server.register error: ${err.message}`)
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
    Logger.error(`server.start error: ${err.message}`)
    throw err
  }

  Logger.info(`Server starting at ${server.info.uri}`)

  server.route(Routes)

  CronJob(GithubActivity, Config.jobs.frequency.githubActivity)
  CronJob(UpdateCache, Config.jobs.frequency.updateCache)
})

module.exports = server
