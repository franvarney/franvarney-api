const Logger = require('franston')('jobs/update-cache')

const GithubActivity = require('../models/github/activity')
const GithubActivityCache = require('../models/github/activity-cache')
const Recurse = require('../helpers/recurse')

function saveActivityCounts(item, index, next) {
  let date = Object.keys(item)[0]

  // keeps the front-end graph looking pretty
  if (item[date] > 60) item[date] -= 25
  if (item[date] > 80) item[date] -= 35

  GithubActivityCache.update(
    { date }, { date, total: item[date] },
    { upsert: true, setDefaultsOnInsert: true },
    (err) => {
      if (err) return Logger.error(err), next(err)
      return next()
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

module.exports = function updateActivityCache() {
  Logger.info('Running job...')

  updateCache((err) => {
    if (err) return Logger.error(`error: ${err.message}`)
    Logger.info('...completed')
  })
}
