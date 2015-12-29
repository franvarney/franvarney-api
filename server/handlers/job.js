import {badRequest, notFound} from 'boom'
import Joi from 'joi'
import Logger from '@modulus/logger'

import Job from '../models/job'

let logger = Logger('handlers/job')

export default {

  /////////// Job.create \\\\\\\\\\
  create: {
    validate: {
      payload: {
        employer: Joi.string().required(),
        location: {
          city: Joi.string(),
          state: Joi.string()
        },
        dates: {
          start: Joi.string().required(),
          end: Joi.string()
        },
        title: Joi.string().required(),
        responsibilities: Joi.array()
      }
    },
    handler: function (request, reply) {
      let {employer, location, dates, responsibilities, title} = request.payload

      let newJob =  {
        employer: employer,
        location: {
          city: location.city,
          state: location.state
        },
        dates: {
          start: dates.start,
          end: dates.end
        },
        title: title,
        responsibilities: responsibilities
      }

      new Job(newJob).save((err, created) => {
        if (err) {
          logger.error(`Job.create error: ${err}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Job.create saved ${JSON.stringify(created)}`)
        reply(created)
      })
    }
  }
}
