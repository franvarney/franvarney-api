const Joi = require('joi')

exports.create = Joi.object({
  title: Joi.string().required(),
  image: Joi.string(),
  caption: Joi.string(),
  summary: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.array()
})

exports.getAllQuery = Joi.object({
  latest: Joi.boolean()
})

exports.update = Joi.object({
  title: Joi.string(),
  image: Joi.string(),
  caption: Joi.string(),
  summary: Joi.string(),
  content: Joi.string(),
  tags: Joi.array(),
  latest: Joi.boolean()
})
