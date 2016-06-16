const Joi = require('joi')

exports.getAllQuery = Joi.object({
  visitors: Joi.boolean()
}).options({ stripUnknown: true })
