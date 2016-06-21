const Joi = require('joi')

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
    name: Joi.string().allow('', null)
  }
}).options({ stripUnknown: true })

exports.getAllQuery = Joi.object({
  visitors: Joi.boolean()
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

