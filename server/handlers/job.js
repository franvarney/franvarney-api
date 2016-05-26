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
      employer,
      location: {
        city: location.city,
        state: location.state
      },
      dates: {
        start: dates.start,
        end: dates.end
      },
      title,
      tasks
    }

    new Job(newJob).save((err, created) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      Logger.debug(created)
      return reply(created)
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
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      Logger.debug(job)
      return reply(job)
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
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      Logger.debug(jobs)
      return reply(jobs)
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
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      Logger.debug(request.params.id)
      return reply()
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
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      Logger.debug(params.id)
      reply(params.id)
    })
  }
}
