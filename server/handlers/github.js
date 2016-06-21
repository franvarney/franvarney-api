const Boom = require('boom')
const Logger = require('franston')('handlers/github')

const DateSort = require('../helpers/date-sort')
const GithubCache = require('../models/github-cache')

exports.getAll = function (request, reply) {
  GithubCache.find({}, (err, activities) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))

    activities.sort(DateSort.bind(null, 1))
    return (Logger.debug(activities), reply(activities))
  })
}
