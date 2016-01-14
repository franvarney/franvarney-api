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
        content: Joi.string().required(),
        tags: Joi.array()
      }
    },
    handler: function (request, reply) {
      let {caption, content, image, tags, title} = request.payload

      let newPost =  {
        title: title,
        slug: Slug(title, { lower: true }),
        image: image,
        caption: caption,
        content: content,
        tags: tags
      }

      new Post(newPost).save((err, created) => {
        if (err) {
          logger.error(`Post.create error: ${err.message}`)
          return reply(badRequest(err.message))
        }

        logger.debug(`Post.create saved ${JSON.stringify(created)}`)
        reply(created)
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
  }
}
