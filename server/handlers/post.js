const Boom = require('boom')
const Joi = require('joi')
const Logger = require('franston')('handlers/post')
const Slug = require('slug')

const Post = require('../models/blog/post')

exports.create = {
  validate: {
    payload: {
      title: Joi.string().required(),
      image: Joi.string(),
      caption: Joi.string(),
      summary: Joi.string().required(),
      content: Joi.string().required(),
      tags: Joi.array()
    }
  },
  handler: function (request, reply) {
    let {caption, content, image, summary, tags, title} = request.payload

    let newPost =  {
      title,
      slug: Slug(title, { lower: true }),
      image,
      caption,
      summary,
      content,
      tags
    }

    new Post(newPost).save((err, created) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))

      Post.update(
        { slug: { $ne: created.slug } },
        { latest: false },
        { multi: true },
        (err, count) => {
          if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
          return Logger.debug(created), reply(created)
        })
    })
  }
}

exports.get = {
  auth: false,
  validate: {
    params: {
      slug: Joi.string().required()
    }
  },
  handler: function (request, reply) {
    Post.findOne({ slug: request.params.slug }, (err, post) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      return Logger.debug(post), reply(post)
    })
  }
}

exports.getAll = {
  auth: false,
  validate: {
    query: {
      latest: Joi.boolean()
    }
  },
  handler: function (request, reply) {
    let query = request.query && request.query.latest ? { latest: true } : {}

    Post.find(query, (err, posts) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))

      posts = posts.sort((a, b) => {
        a = new Date(a.createdAt)
        b = new Date(b.createdAt)

        if (a < b) return 1
        if (a > b) return -1

        return 0
      })

      return Logger.debug(posts), reply(posts)
    })
  }
}

exports.remove = {
  validate: {
    params: {
      slug: Joi.string().required()
    }
  },
  handler: function (request, reply) {
    Post.remove({ slug: request.params.slug }, (err) => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err.message))
      return Logger.debug(request.params.slug), reply()
    })
  }
}

exports.update = {
  validate: {
    params: {
      slug: Joi.string().required()
    },
    payload: {
      title: Joi.string(),
      image: Joi.string(),
      caption: Joi.string(),
      summary: Joi.string(),
      content: Joi.string(),
      tags: Joi.array(),
      latest: Joi.boolean()
    }
  },
  handler: function (request, reply) {
    let {params, payload} = request

    Post.update({ slug: params.slug }, payload, (err) => {
      if (err) return Logger.error(err), reply(BoombadRequest(err.message))
      return  Logger.debug(params.slug), reply(params.slug)
    })
  }
}
