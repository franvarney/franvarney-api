const Boom = require('boom')
const Debug = require('debug')('handlers/job')

const Job = require('../models/job')

exports.create = function (request, reply) {
  let {employer, location, dates, tasks, title} = request.payload

  let newJob = {
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

  Job.create(newJob, (err, created) => {
    if (err) return (Debug(err), reply(Boom.badRequest(err)))
    return Debug(created), reply(created)
  })
}

exports.get = function (request, reply) {
  Job.findOne({ id: request.params.id }, (err, job) => {
    if (err) return (Debug(err), reply(Boom.badRequest(err)))
    return Debug(job), reply(job)
  })
}

exports.getAll = function (request, reply) {
  let query = {}

  if (request.query && request.query.present) {
    query = { 'dates.end': 'Present' }
  }

  Job.find(query, (err, jobs) => {
    if (err) return (Debug(err), reply(Boom.badRequest(err)))
    return Debug(jobs), reply(jobs)
  })
}

exports.remove = function (request, reply) {
  Job.remove({ id: request.params.id }, (err) => {
    if (err) return (Debug(err), reply(Boom.badRequest(err)))
    return Debug(request.params.id), reply()
  })
}

exports.update = function (request, reply) {
  let {params, payload} = request

  Job.update({ id: params.id }, payload, (err) => {
    if (err) return (Debug(err), reply(Boom.badRequest(err)))
    return Debug(params.id), reply(params.id)
  })
}
