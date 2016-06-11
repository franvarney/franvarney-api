const Boom = require('boom')
const Logger = require('franston')('handlers/job')

const Job = require('../models/job')

exports.create = function (request, reply) {
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
    if (err) return Logger.error(err), reply(Boom.badRequest(err))
    return /*Logger.debug(created),*/ reply(created)
  })
}

exports.get = function (request, reply) {
  Job.findOne({ id: request.params.id }, (err, job) => {
    if (err) return Logger.error(err), reply(Boom.badRequest(err))
    return /*Logger.debug(job),*/ reply(job)
  })
}

exports.getAll = function (request, reply) {
  let query = {}

  if (request.query && request.query.present) {
    query = { 'dates.end': 'Present' }
  }

  Job.find(query, (err, jobs) => {
    if (err) return Logger.error(err), reply(Boom.badRequest(err))
    return /*Logger.debug(jobs),*/ reply(jobs)
  })
}

exports.remove = function (request, reply) {
  Job.remove({ id: request.params.id }, (err) => {
    if (err) return Logger.error(err), reply(Boom.badRequest(err))
    return /*Logger.debug(request.params.id),*/ reply()
  })
}

exports.update = function (request, reply) {
  let {params, payload} = request

  Job.update({ id: params.id }, payload, (err) => {
    if (err) return Logger.error(err), reply(Boom.badRequest(err))
    return /*Logger.debug(params.id),*/ reply(params.id)
  })
}
