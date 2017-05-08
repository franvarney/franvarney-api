const Boom = require('boom')
const Debug = require('debug')('handlers/github')

const DateSort = require('../helpers/date-sort')
const GithubCache = require('../models/github-cache')

exports.getAll = function (request, reply) {
  GithubCache.find({}, (err, activities) => {
    if (err) return (Debug(err), reply(Boom.badRequest(err)))

    activities.sort(DateSort.bind(null, 1))
    return (Debug(activities), reply(activities))
  })
}
