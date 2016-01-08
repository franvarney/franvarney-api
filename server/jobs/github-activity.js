import Logger from '@modulus/logger'
import Request from 'request'

import Config from '../../config'
import yesterdaysDate from '../helpers/yesterdays-date'
import GithubActivityModel from '../models/github/activity'

let logger = Logger('jobs/github-activity')

const EVENT_TYPES = ['IssuesEvent', 'PullRequestEvent', 'PushEvent']
const PER_PAGE = 100

function parseEvents(body, done) {
  let yesterday = yesterdaysDate()

  let events = body.filter((event) => {
    return EVENT_TYPES.indexOf(event.type) > -1 &&
      new Date(event.created_at) < yesterday
  })

  if (events) {
    events = events.map((event) => {
      let {id, type, payload, created_at} = event

      return {
        id: id,
        type: type,
        count: payload.distinct_size ? payload.distinct_size : 1,
        created: created_at
      }
    })

    function next(remaining) {
      let event = remaining.shift()

      if (!event) return done()

      let eventDate = new Date(event.created)

      GithubActivityModel.findOne({ id: event.id }, function (err, found) {
        if (err) {
          logger.error(`GithubActivityModel.find error: ${err.message}`)
          return next(remaining)
        }

        if (!found) {
          new GithubActivityModel(event).save(function (err, created) {
            if (err) {
              logger.error(`GithubActivityModel.create error: ${err.message}`)
            }

            logger.debug(`GithubActivityModel.create saved ${JSON.stringify(created)}`)
            next(remaining)
          })
        } else if (found.id === event.id && found.count !== event.count) {
          GithubActivityModel.update({ id: event.id }, event, function (err, updated) {
            if (err) {
              logger.error(`GithubActivityModel.update error: ${err.message}`)
            }

            logger.debug(`GithubActivityModel.update saved ${JSON.stringify(updated)}`)
            next(remaining)
          })
        } else {
          next(remaining)
        }
      })
    }

    next(events.slice())
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
      per_page: PER_PAGE,
      page: page
    },
    json: true
  }

  Request(options, (err, response, body) => {
    if (err) return done(err)

    if (response.statusCode === 200 && body.length > 0) {
      parseEvents(body, (err) => {
        if (err) {
          logger.error(`github-activity err: ${err.message}`)
          return done(err)
        }

        getEvents(++page, done)
      })
    } else {
      logger.error(body.message)
      return done()
    }
  })
}

export default function () {
  logger.info('Running github-activity job...')

  getEvents(1, (err) => {
    if (err) {
      logger.error(`github-activity err: ${err.message}`)
    }

    logger.info('github-activity job completed')
  })
}
