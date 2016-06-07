const Boom = require('boom')
const Logger = require('franston')('handlers/github')

const GithubActivityCache = require('../models/github/activity-cache')

exports.getAll = {
  auth: false,
  handler: function (request, reply) {
    GithubActivityCache.find({}, (err, activities) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))

      activities = activities.sort((a, b) => {
        a = new Date(a.date)
        b = new Date(b.date)

        if (a < b) return -1
        if (a > b) return 1

        return 0
      })

      return Logger.debug(activities), reply(activities)
    })
  }
}
