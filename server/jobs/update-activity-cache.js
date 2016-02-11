import Logger from '@modulus/logger'

import GithubActivity from '../models/github/activity'
import GithubActivityCache from '../models/github/activity-cache'
import Recurse from '../helpers/recurse'

let logger = Logger('jobs/update-cache')

function saveActivityCounts(item, index, next) {
  let date = Object.keys(item)[0]

  // keeps the front-end graph looking pretty
  if (item[date] > 60) item[date] -= 25
  if (item[date] > 80) item[date] -= 35

  GithubActivityCache.update(
    { date: date },
    { date: date, total: item[date] },
    { upsert: true, setDefaultsOnInsert: true },
    (err) => {
      if (err) {
        logger.error(`GithubActivityCache.update error: ${err.message}`)
        return next(err)
      }

      next()
    })
}

function updateCache(done) {
  GithubActivity.find({}, (err, found) => {
    if (err) return done(err)

    let dateMap = {}

    found.forEach((event) => {
      let date = new Date(event.created).toDateString()

      if (dateMap.hasOwnProperty(date)) dateMap[date] += parseInt(event.count)
      else dateMap[date] = parseInt(event.count)
    })

    Recurse(dateMap, saveActivityCounts, done)
  })
}

export default function updateActivityCache() {
  logger.info('Running job...')

  updateCache((err) => {
    if (err) return logger.error(`error: ${err.message}`)
    logger.info('...completed')
  })
}
