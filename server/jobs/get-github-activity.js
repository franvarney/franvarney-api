const Debug = require('debug')('jobs/github-activity')
const Request = require('request')

const Config = require('../../config')
const DaysAgo = require('../helpers/days-ago')
const GithubActivity = require('../models/github-activity')
const Series = require('run-series')

const EVENT_TYPES = ['IssuesEvent', 'PullRequestEvent', 'PushEvent']
const PER_PAGE = 100

function saveActivities (event, next) {
  let options = {
    upsert: true,
    setDefaultsOnInsert: true
  }

  GithubActivity.update({ id: event.id }, event, options, (err) => {
    if (err) return (Debug(err), next(err))
    return next()
  })
}

function parseEvents (body, done) {
  let yesterday = DaysAgo(1)

  let events = body.filter((event) => {
    return EVENT_TYPES.indexOf(event.type) > -1 &&
           new Date(event.created_at) < yesterday
  })

  if (events) {
    events = events.map((event) => {
      let {id, type, payload, created_at} = event

      event = {
        id,
        type,
        count: payload.distinct_size ? payload.distinct_size : 1,
        created: created_at
      }

      return saveActivities.bind(null, event)
    })

    return Series(events, done)
  }
}

function getEvents (page, done) {
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
      page
    },
    json: true
  }

  Request(options, (err, response, body) => {
    if (err) return done(err)

    if (response.statusCode === 200 && body.length > 0) {
      parseEvents(body, (err) => {
        if (err) return done(err)
        return getEvents(++page, done)
      })
    } else return (Debug(body.message), done())
  })
}

module.exports = function getGithubActivity () {
  Debug('Running job...')

  getEvents(1, (err) => {
    if (err) return Debug(err)
    return Debug('...completed')
  })
}
