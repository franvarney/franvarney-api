const {Server} = require('hapi')
const Debug = require('debug')('server/index')
const Mongoose = require('mongoose')

const Auth = require('./handlers/auth')
const Config = require('../config')
const CronJob = require('../server/jobs')
const GithubActivity = require('./jobs/get-github-activity')
const Plugins = require('./plugins')
const Routes = require('./routes')
const SwarmPlaces = require('./jobs/get-swarm-places')
const UpdateCache = require('./jobs/update-activity-cache')

const server = new Server()

Mongoose.connect(Config.mongo.url, (err) => {
  if (err) throw err
  Debug(`Connected to ${Config.mongo.url}`)
})

server.connection({
  host: Config.env !== 'production' ? Config.host : null,
  port: parseInt(Config.port, 10),
  routes: { cors: true }
})

server.register(Plugins, (err) => {
  if (err) throw err

  server.auth.strategy('simple', 'bearer-access-token', {
    accessTokenName: 'auth_token',
    allowQueryToken: false,
    allowMultipleHeaders: false,
    validateFunc: Auth.validate
  })

  server.auth.default({
    strategy: 'simple'
  })

  server.start((err) => {
    if (err) throw err

    Debug(`Server starting at ${server.info.uri}`)

    server.route(Routes)

    CronJob(GithubActivity, Config.jobs.frequency.githubActivity)
    CronJob(SwarmPlaces, Config.jobs.frequency.swarmPlaces)
    CronJob(UpdateCache, Config.jobs.frequency.updateCache)
  })
})

module.exports = server
