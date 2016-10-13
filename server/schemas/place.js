const Joi = require('joi')

exports.callbackQuery = Joi.object({
  code: Joi.string()
}).options({ stripUnknown: true })

exports.create = Joi.object({
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
    name: Joi.string().default('Anonymous')
  }
}).options({ stripUnknown: true })

exports.getAllQuery = Joi.object({
  visitors: Joi.boolean(),
  condensed: Joi.boolean()
}).options({ stripUnknown: true })

exports.response = Joi.array().items(Joi.object({
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).rename('lat', 'latitude')
    .rename('lng', 'longitude'),
  name: Joi.string().required(),
  placeId: Joi.string().required()
}).rename('place_id', 'placeId')
  .options({ stripUnknown: true }))

exports.searchQuery = Joi.object({
  location: Joi.string().required(),
  keyword: Joi.string()
})

exports.updatePayload = Joi.object({
  location: {
    latitude: Joi.number(),
    longitude: Joi.number()
  },
  place: {
    id: Joi.string(),
    name: Joi.string(),
    type: Joi.string().allow(['Swarm', 'Google'])
  },
  visitor: {
    message: Joi.string(),
    name: Joi.string().default('Anonymous')
  },
  isVisitor: Joi.boolean()
}).options({ stripUnknown: true })
