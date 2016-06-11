const Joi = require('joi')

exports.create = Joi.object({
  employer: Joi.string().required(),
  location: {
    city: Joi.string(),
    state: Joi.string()
  },
  dates: {
    start: Joi.string().required(),
    end: Joi.string()
  },
  title: Joi.string().required(),
  tasks: Joi.array()
}).options({ stripUnknown: true })

exports.getAllQuery = Joi.object({
  present: Joi.string()
}).options({ stripUnknown: true })

exports.update = Joi.object({
  employer: Joi.string(),
  location: {
    city: Joi.string(),
    state: Joi.string()
  },
  dates: {
    start: Joi.string(),
    end: Joi.string()
  },
  title: Joi.string(),
  tasks: Joi.array()
}).options({ stripUnknown: true })
