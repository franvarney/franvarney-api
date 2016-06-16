const Boom = require('boom')
const Logger = require('franston')('handlers/places')
const Joi = require('joi')
const Wreck = require('wreck')

const Config = require('../../config')
const Place = require('../models/place')

exports.create = {
  auth: false,
  validate: {
    payload: Joi.object({
      location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      }),
      place: {
        id: Joi.string(),
        name: Joi.string()
      },
      visitor: {
        message: Joi.string().required(),
        name: Joi.string().allow("", null)
      }
    }).options({ stripUnknown: true })
  },
  handler: function (request, reply) {
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
      if (err) return Logger.error(err), reply(Boom.badRequest(err))
      return /*Logger.debug(created),*/ reply(created).code(201)
    })
  }
}

exports.delete = function (request, reply) {
  Place.findById(request.params.id, function (err, place) {
    if (err) return Logger.error(err), reply(Boom.badRequest(err))
    if (!place) return Logger.error('Place not found'), reply(Boom.notFound('Place not found'))

    place.remove((err) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err))
      return reply().code(204)
    });
  })
}

exports.getAll = function (request, reply) {
  let query = {}

  if (request.query.visitors !== null &&
      request.query.visitors !== undefined) {
    query = { isVisitor: request.query.visitors }
  }

  Place.find(query, (err, places) => {
    if (err) return Logger.error(err), reply(Boom.badRequest(err))
    return /*Logger.debug(places),*/ reply(places)
  })
}

exports.search = {
  auth: false,
  response: {
    modify: true,
    schema: Joi.array().items(Joi.object({
      location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      }).rename('lat', 'latitude')
        .rename('lng', 'longitude'),
      name: Joi.string().required(),
      placeId: Joi.string().required()
    }).rename('place_id', 'placeId')
      .options({ stripUnknown: true }))
  },
  validate: {
    query: Joi.object({
      location: Joi.string().required(),
      keyword: Joi.string()
    })
  },
  handler: {
    proxy: {
      mapUri: function (request, callback) {
        let url = `${Config.google.nearbySearchApiUrl}?key=${Config.google.apiKey}&location=${request.query.location}`

        if (request.query.keyword) url = `${url}&rankby=distance&keyword=${request.query.keyword}`
        else url = `${url}&radius=5000`

        Logger.debug(`Proxying to ${url}`)
        return callback(null, url);
      },
      onResponse: function (err, response, request, reply) {
        Wreck.read(response, { json: true }, (err, payload) => {
          if (payload && payload.status !== 'OK') err = payload.status
          if (err) return Logger.error(err), reply(Boom.badRequest(err))

          payload.results.forEach((place) => {
            place.location = place.geometry.location
          })

          return /*Logger.debug(payload.results),*/ reply(payload.results)
        });
      }
    }
  }
}

exports.update = function (request, reply) {
  Place.findById(request.params.id, function (err, place) {
    if (err) return Logger.error(err), reply(Boom.badRequest(err))

    if (!place) return Logger.error('Place not found'), reply(Boom.notFound('Place not found'))

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
      if (err) return Logger.error(err), reply(Boom.badRequest(err))
      return reply(place)
    });
  })
}
