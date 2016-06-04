const Boom = require('boom')
const Logger = require('@modulus/logger')('handlers/places')
const Joi = require('joi')
const Wreck = require('wreck')

const Config = require('../../config')
const Places = require('../models/places')

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

exports.create = {
  auth: false,
  validate: {
    payload: Joi.object({
      location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      }),
      message: Joi.string().required(),
      name: Joi.string().required(),
      placeId: Joi.string().required(),
    })
  },
  handler: function (request, reply) {
    let {location, message, name, placeId} = request.payload
    let newPlace = { location, name, placeId }

    if (message === Config.authToken) newPlace.isVisitor = false
    else newPlace.message = message

    new Place(newPlace).save((err, created) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      Logger.debug(created)
      return reply(created)
    })
  }
}

