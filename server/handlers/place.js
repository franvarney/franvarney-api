const Boom = require('boom')
const Logger = require('franston')('handlers/places')
const Request = require('request')
const Wreck = require('wreck')

const Config = require('../../config')
const Place = require('../models/place')

exports.swarmCallback = function (request, reply) {
  Logger.info('Retrieving Swarm code or token')

  if (request.payload && request.payload.access_token) {
    return reply({ token: request.payload.access_token })
  }

  return reply()
}

exports.create = function (request, reply) {
  let {location, place, visitor} = request.payload
  let newPlace = { location, place, visitor }

  if (visitor.message === Config.authToken) {
    newPlace.visitor = {
      message: null,
      name: 'Fran Varney'
    }
    newPlace.isVisitor = false
  } else if (visitor.name === Config.authToken) {
    newPlace.visitor = {
      message: visitor.message,
      name: 'Fran Varney'
    }
    newPlace.isVisitor = false
  } else if (!visitor.name) {
    newPlace.visitor.name = 'Anonymous'
    newPlace.isVisitor = false
  } else {
    newPlace.isVisitor = false
  }

  new Place(newPlace).save((err, created) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
    return /* Logger.debug(created), */ reply(created).code(201)
  })
}

exports.delete = function (request, reply) {
  Place.findById(request.params.id, function (err, place) {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
    if (!place) return (Logger.error('Place not found'), reply(Boom.notFound('Place not found')))

    place.remove((err) => {
      if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
      return reply().code(204)
    })
  })
}

exports.getAll = function (request, reply) {
  let query = {}

  if (request.query.visitors !== null &&
      request.query.visitors !== undefined) {
    query = { isVisitor: request.query.visitors }
  }

  Place.find(query).sort({ createdAt: -1 }).exec((err, places) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
    return reply(places)
  })
}

exports.search = {
  proxy: {
    mapUri: function (request, callback) {
      let url = `${Config.google.nearbySearchApiUrl}?key=${Config.google.apiKey}&location=${request.query.location}`

      if (request.query.keyword) url = `${url}&rankby=distance&keyword=${request.query.keyword}`
      else url = `${url}&radius=5000`

      Logger.debug(`Proxying to ${url}`)
      return callback(null, url)
    },
    onResponse: function (err, response, request, reply) {
      if (err) return (Logger.error(err), reply(Boom.badRequest(err)))

      Wreck.read(response, { json: true }, (err, payload) => {
        if (payload && payload.status !== 'OK') err = payload.status
        if (err) return (Logger.error(err), reply(Boom.badRequest(err)))

        payload.results.forEach((place) => {
          place.location = place.geometry.location
        })

        return /* Logger.debug(payload.results), */ reply(payload.results)
      })
    }
  }
}

exports.update = function (request, reply) {
  Place.findById(request.params.id, function (err, place) {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))

    if (!place) return (Logger.error('Place not found'), reply(Boom.notFound('Place not found')))

    if (place.visitor && request.payload.visitor) {
      place.visitor = Object.assign(place.visitor, request.payload.visitor)
    }

    if (place.place && request.payload.place) {
      place.place = Object.assign(place.place, request.payload.place)
    }

    if (place.location && request.payload.location) {
      place.location = Object.assign(place.location, request.payload.location)
    }

    if (place.isVisitor !== request.payload.isVisitor) {
      place.isVisitor = request.payload.isVisitor
    }

    place.save((err) => {
      if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
      return reply(place)
    })
  })
}
