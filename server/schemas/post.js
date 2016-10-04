const Joi = require('joi')

exports.create = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  image: Joi.string(),
  caption: Joi.string(),
  summary: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.array(),
  isHtml: Joi.boolean().default(false),
  isLatest: Joi.boolean().default(false)
}).options({ stripUnknown: true })

exports.getAllQuery = Joi.object({
  latest: Joi.boolean()
})

exports.update = Joi.object({
  title: Joi.string(),
  category: Joi.string(),
  image: Joi.string(),
  caption: Joi.string(),
  summary: Joi.string(),
  content: Joi.string(),
  tags: Joi.array(),
  isLatest: Joi.boolean(),
  isPreview: Joi.boolean(),
  isHtml: Joi.boolean(),
}).options({ stripUnknown: true })
