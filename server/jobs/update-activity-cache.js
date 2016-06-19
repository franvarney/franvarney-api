const Logger = require('franston')('jobs/update-cache')

const GithubActivity = require('../models/github-activity')
const GithubCache = require('../models/github-cache')
const Series = require('run-series')

let dateMap = {}

function saveActivityCounts(date, next) {
  let count = dateMap[date]
  let options = {
    upsert: true,
    setDefaultsOnInsert: true
  }

  GithubCache.update({ date }, { date, total: count }, options, (err) => {
    if (err) return Logger.error(err), next(err)
    return next()
  })
}

function updateCache(done) {
  GithubActivity.find({}, (err, found) => {
    if (err) return done(err)

    found.forEach((event) => {
      let date = new Date(event.created).toDateString()

      if (dateMap.hasOwnProperty(date)) dateMap[date] += parseInt(event.count, 10)
      else dateMap[date] = parseInt(event.count, 10)
    })

    return Series(Object.keys(dateMap).map((date) => saveActivityCounts.bind(null, date)))
  })
}

module.exports = function updateActivityCache() {
  Logger.info('Running job...')

  updateCache((err) => {
    if (err) return Logger.error(`error: ${err.message}`)
    return Logger.info('...completed')
  })
}
