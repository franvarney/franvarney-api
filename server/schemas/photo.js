const Joi = require('joi')

exports.getAllQuery = Joi.object({
  page: Joi.number(),
  limit: Joi.number()
}).options({ stripUnknown: true })
