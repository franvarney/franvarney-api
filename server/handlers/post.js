import {badRequest, notFound} from 'boom'
import Joi from 'joi'
import Logger from '@modulus/logger'
import Slug from 'slug'

import Post from '../models/blog/post'

let logger = Logger('handlers/post')

export default {

  /////////// Post.create \\\\\\\\\\
  create: {
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
        title: title,
        slug: Slug(title, { lower: true }),
        image: image,
        caption: caption,
        summary: summary,
        content: content,
        tags: tags
      }

      new Post(newPost).save((err, created) => {
        if (err) {
          logger.error(`Post.create error: ${err.message}`)
          return reply(badRequest(err.message))
        }

        Post.update(
          { slug: { $ne: created.slug } },
          { latest: false },
          { multi: true },
          (err, count) => {
            if (err) {
              logger.error(`Post.update error: ${err.message}`)
              return reply(badRequest(err.message))
            }

            logger.debug(`Post.update updated latest`)
            logger.debug(`Post.create saved ${JSON.stringify(created)}`)

            reply(created)
          })
      })
    }
  },

  ////////// Post.get \\\\\\\\\\
  get: {
    validate: {
      params: {
        slug: Joi.string().required()
      }
    },
    handler: function (request, reply) {
      Post.findOne({ slug: request.params.slug }, (err, post) => {
        if (err) {
          logger.error(`Job.findOne error: ${err.message}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Post.findOne found ${JSON.stringify(post)}`)
        reply(post)
      })
    }
  },

  ////////// Post.getAll \\\\\\\\\\
  getAll: {
    validate: {
      query: {
        latest: Joi.boolean()
      }
    },
    handler: function (request, reply) {
      let query = request.query && request.query.latest ? { latest: true } : {}

      Post.find(query, (err, posts) => {
        if (err) {
          logger.error(`Post.find error: ${err.message}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Post.find found ${JSON.stringify(posts)}`)

        posts = posts.sort((a, b) => {
          a = new Date(a.createdAt)
          b = new Date(b.createdAt)

          if(a < b) return -1
          if(a > b) return 1

          return 0
        })

        reply(posts)
      })
    }
  },

  ////////// Post.remove \\\\\\\\\\
  remove: {
    validate: {
      params: {
        slug: Joi.string().required()
      }
    },
    handler: function (request, reply) {
      Post.remove({ slug: request.params.slug }, (err) => {
        if (err) {
          logger.error(`Post.remove error: ${err.message}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Post.remove removed ${request.params.slug}`)
        reply()
      })
    }
  },

  ////////// Post.update \\\\\\\\\\
  update: {
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
        if (err) {
          logger.error(`Post.update error: ${err.message}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Post.update updated ${params.slug}`)
        reply(params.slug)
      })
    }
  }
}
