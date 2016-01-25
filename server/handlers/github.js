import {badRequest} from 'boom'
import Logger from '@modulus/logger'

import GithubActivityCache from '../models/github/activity-cache'

let logger = Logger('handlers/github')

export default {

  /////////// Github.getAll \\\\\\\\\\
  getAll: {
    auth: false,
    handler: function (request, reply) {
      GithubActivityCache.find({}, (err, activities) => {
        if (err) {
          logger.error(`GithubActivityCache.find error: ${err.message}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`GithubActivityCache.find found ${JSON.stringify(activities)}`)

        activities = activities.sort((a, b) => {
          a = new Date(a.date)
          b = new Date(b.date)

          if(a < b) return -1
          if(a > b) return 1

          return 0
        })

        reply(activities)
      })
    }
  }
}
