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
    name: Joi.string().allow("", null)
  }
}).options({ stripUnknown: true })

exports.getAllQuery = Joi.object({
  visitors: Joi.boolean()
}).options({ stripUnknown: true })
