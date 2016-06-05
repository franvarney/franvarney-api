const Boom = require('boom')
const Logger = require('@modulus/logger')('handlers/places')
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
        name: Joi.string()
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
    } else if (!visitor.name) newPlace.visitor.name = 'Anonymous'

    new Place(newPlace).save((err, created) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      Logger.debug(created)
      return reply(created)
    })
  }
}

exports.getAll = {
  auth: false,
  handler: function (request, reply) {
    Place.find({}, (err, places) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      return Logger.debug(places), reply(places)
    })
  }
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

          return reply(payload.results)
        });
      }
    }
  }
}
