const Boom = require('boom')
const Joi = require('joi')
const Logger = require('@modulus/logger')('handlers/job')

const Job = require('../models/job')

exports.create = {
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
        Logger.error(`Job.create error: ${err.message}`)
        return reply(Boom.badRequest(err.message))
      }

      Logger.debug(`Job.create saved ${JSON.stringify(created)}`)
      reply(created)
    })
  }
}

exports.get = {
  auth: false,
  validate: {
    params: {
      id: Joi.string().required()
    }
  },
  handler: function (request, reply) {
    Job.findOne({ id: request.params.id }, (err, job) => {
      if (err) {
        Logger.error(`Job.findOne error: ${err.message}`)
        return reply(Boom.badRequest(err.message))
      }

      Logger.debug(`Job.findOne found ${JSON.stringify(job)}`)
      reply(job)
    })
  }
}

exports.getAll = {
  auth: false,
  validate: {
    query: {
      present: Joi.string()
    }
  },
  handler: function (request, reply) {
    let query = {}

    if (request.query && request.query.present) {
      query = { 'dates.end': 'Present' }
    }

    Job.find(query, (err, jobs) => {
      if (err) {
        Logger.error(`Job.find error: ${err.message}`)
        return reply(Boom.badRequest(err.message))
      }

      Logger.debug(`Job.find found ${JSON.stringify(jobs)}`)
      reply(jobs)
    })
  }
}

exports.remove = {
  validate: {
    params: {
      id: Joi.string().required()
    }
  },
  handler: function (request, reply) {
    Job.remove({ id: request.params.id }, (err) => {
      if (err) {
        Logger.error(`Job.remove error: ${err.message}`)
        return reply(Boom.badRequest(err.message))
      }

      Logger.debug(`Job.remove removed ${request.params.id}`)
      reply()
    })
  }
}

exports.update = {
  validate: {
    params: {
      id: Joi.string().required()
    },
    payload: {
      employer: Joi.string(),
      location: {
        city: Joi.string(),
        state: Joi.string()
      },
      dates: {
        start: Joi.string(),
        end: Joi.string()
      },
      title: Joi.string(),
      tasks: Joi.array()
    }
  },
  handler: function (request, reply) {
    let {params, payload} = request

    Job.update({ id: params.id }, payload, (err) => {
      if (err) {
        Logger.error(`Job.update error: ${err.message}`)
        return reply(Boom.badRequest(err.message))
      }

      Logger.debug(`Job.update updated ${params.id}`)
      reply(params.id)
    })
  }
}
