import Logger from '@modulus/logger'
import Request from 'request'

import Config from '../../config'
import yesterdaysDate from '../helpers/yesterdays-date'
import GithubActivityModel from '../models/github/activity'

let logger = Logger('jobs/github-activity')

const EVENT_TYPES = ['IssuesEvent', 'PullRequestEvent', 'PushEvent']
const PER_PAGE = 100

function parseEvents(body) {
  let yesterday = yesterdaysDate()

  let events = body.filter((event) => {
    // ignore everything other than what's in EVENT_TYPES and ignore anything
    // from the current day (as these will be processed the next day)
    return EVENT_TYPES.indexOf(event.type) > -1 &&
      new Date(event.created_at).toDateString() < yesterday.toDateString()
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

    events.forEach((event) => {
      let eventDate = new Date(event.created)

      if (eventDate.toDateString() === yesterday.toDateString()) {
        GithubActivityModel.create(event, (err, created) => {
          if (err) {
            logger.error(`GithubActivityModel.create error: ${err.message}`)
            return
          }

          logger.debug(`GithubActivityModel.create saved ${JSON.stringify(created)}`)
        })
      } else if (eventDate.toDateString() < yesterday.toDateString()) {
        // just in case there new events or updated events past yesterdays date
        // TODO: #1 figure out how GitHub events work
        GithubActivityModel.update(
          { id: event.id }, event,
          { upsert: true, setDefaultsOnInsert: true },
          (err, updated) => {
            if (err) {
              logger.error(`GithubActivityModel.update error: ${err.message}`)
              return
            }

            logger.debug(`GithubActivityModel.update saved ${JSON.stringify(updated)}`)
          })
      }
    })
  }
}

function getEvents(page, done) {
  if (page === 4) return done()

  let options = {
    url: `${Config.github.apiUrl}/users/${Config.github.username}/events?per_page=${PER_PAGE}&page=${page}`,
    method: 'GET',
    headers: {
      'User-Agent': Config.github.username
    },
    json: true
  }

  Request(options, (err, response, body) => {
    if (err) return done(err)

    if (response.statusCode === 200 && body.length > 0) {
      parseEvents(body)
      getEvents(++page, done)
    } else {
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
