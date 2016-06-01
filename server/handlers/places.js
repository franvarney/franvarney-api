const Boom = require('boom')
const Logger = require('@modulus/logger')('handlers/places')
const Joi = require('joi')
const Wreck = require('wreck')

const Config = require('../../config')

exports.search = {
  response: {
    modify: true,
    schema: Joi.array().items(Joi.object({
      geometry: {
        location: {
          lat: Joi.number().required(),
          lng: Joi.number().required()
        }
      },
      name: Joi.string().required(),
      place_id: Joi.string().required()
    }).options({ stripUnknown: true }))
  },
  validate: {
    query: {
      location: Joi.string().required(),
      keyword: Joi.string()
    }
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
          return reply(payload.results)
        });
      }
    }
  }
}
