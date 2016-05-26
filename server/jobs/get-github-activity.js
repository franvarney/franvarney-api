const Logger = require('@modulus/logger')('jobs/github-activity')
const Request = require('request')

const Config = require('../../config')
const GithubActivityModel = require('../models/github/activity')
const Recurse = require('../helpers/recurse')
const DaysAgo = require('../helpers/days-ago')

const EVENT_TYPES = ['IssuesEvent', 'PullRequestEvent', 'PushEvent']
const PER_PAGE = 100

function saveActivities(item, index, next) {
  GithubActivityModel.update(
    { id: item.id }, item,
    { upsert: true, setDefaultsOnInsert: true },
    (err) => {
      if (err) return Logger.error(err), next(err)
      return next()
    })
}

function parseEvents(body, done) {
  let yesterday = DaysAgo(1)

  let events = body.filter((event) => {
    return EVENT_TYPES.indexOf(event.type) > -1 &&
      new Date(event.created_at) < yesterday
  })

  if (events) {
    events = events.map((event) => {
      let {id, type, payload, created_at} = event

      return {
        id,
        type,
        count: payload.distinct_size ? payload.distinct_size : 1,
        created: created_at
      }
    })

    Recurse(events, saveActivities, done)
  }
}

function getEvents(page, done) {
  if (page === 4) return done()

  let options = {
    url: `${Config.github.apiUrl}/users/${Config.github.username}/events`,
    method: 'GET',
    headers: {
      'User-Agent': Config.github.username
    },
    qs: {
      access_token: Config.github.accessToken,
      per_page: PER_PAGE,
      page: page
    },
    json: true
  }

  Request(options, (err, response, body) => {
    if (err) return done(err)

    if (response.statusCode === 200 && body.length > 0) {
      parseEvents(body, (err) => {
        if (err) return done(err)
        getEvents(++page, done)
      })
    } else {
      Logger.error(body.message)
      return done()
    }
  })
}

module.exports = function getGithubActivity() {
  Logger.info('Running job...')

  getEvents(1, (err) => {
    if (err) return Logger.error(`error: ${err.message}`)
    Logger.info('...completed')
  })
}
