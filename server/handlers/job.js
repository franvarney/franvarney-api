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
        tasks: Joi.array()
      }
    },
    handler: function (request, reply) {
      let {employer, location, dates, tasks, title} = request.payload

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
        tasks: tasks
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
  },

  ////////// Job.get \\\\\\\\\\
  get: {
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    handler: function (request, reply) {
      Job.findOne({ id: request.params.id }, (err, job) => {
        if (err) {
          logger.error(`Job.findOne error: ${err}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Job.findOne found ${JSON.stringify(job)}`)
        reply(job)
      })
    }
  },

  ////////// Job.getAll \\\\\\\\\\
  getAll: {
    handler: function (request, reply) {
      Job.find({}, (err, jobs) => {
        if (err) {
          logger.error(`Job.find error: ${err}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Job.find found ${JSON.stringify(jobs)}`)
        reply(jobs)
      })
    }
  },

  ////////// Job.remove \\\\\\\\\\
  remove: {
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    handler: function (request, reply) {
      Job.remove({ id: request.params.id }, (err) => {
        if (err) {
          logger.error(`Job.remove error: ${err}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Job.remove removed ${request.params.id}`)
        reply()
      })
    }
  }
}
