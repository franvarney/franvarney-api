const Boom = require('boom')
const Logger = require('franston')('handlers/github')

const DateSort = require('../helpers/date-sort')
const GithubActivityCache = require('../models/github/activity-cache')

exports.getAll = function (request, reply) {
  GithubActivityCache.find({}, (err, activities) => {
    if (err) return Logger.error(err), reply(Boom.badRequest(err))

    activities.sort(DateSort.bind(null, 1))
    return Logger.debug(activities), reply(activities)
  })
}
