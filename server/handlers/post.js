const Boom = require('boom')
const Logger = require('franston')('handlers/post')
const Slug = require('slug')

const DateSort = require('../helpers/date-sort')
const IsAuthorized = require('../helpers/is-authorized')
const Post = require('../models/post')

exports.create = function (request, reply) {
  Logger.debug('post.create')

  const post = Object.assign({}, request.payload)
  post.slug = Slug(`${post.category} ${post.title}`, { lower: true })

  new Post(post).save((err, created) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
    return reply(created).code(201)
  })
}

exports.get = function (request, reply) {
  Logger.debug('post.get')

  const query = { slug: request.params.slug }

  if (!IsAuthorized(request.auth)) query.isPreview = false

  Post.findOne(query, (err, post) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
    if (!post) return reply(Boom.notFound('Post not found'))
    return reply(post)
  })
}

exports.getAll = function (request, reply) {
  Logger.debug('post.getAll')

  const query = {}

  if (request.query && request.query.latest) query.isLatest = true
  if (!IsAuthorized(request.auth)) query.isPreview = false

  Post.find(query, (err, posts) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
    return reply(posts.sort(DateSort.bind(null, -1)))
  })
}

exports.remove = function (request, reply) {
  Logger.debug('post.remove')

  Post.remove({ slug: request.params.slug }, (err) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
    return reply().code(204)
  })
}

exports.update = function (request, reply) {
  Logger.debug('post.update')

  const query = {
    slug: request.params.slug
  }

  const post = Object.assign({}, request.payload)
  if (post.tags) {
    post.$push = { tags: { $each: post.tags } }
    delete post.tags
  }

  let isLatest = false
  if (post.hasOwnProperty('isLatest') && post.isLatest === true) {
    isLatest = post.isLatest
  }

  post.updatedAt = new Date().toISOString() // TODO see if mongoose-timestamp should do this

  Post.update(query, post, (err) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err)))

    if (!isLatest) return reply().code(204)

    const query = {
      slug: { $ne: request.params.slug }
    }

    return Post.update(query, { isLatest: false }, { multi: true }, (err, count) => {
      if (err) return (Logger.error(err), reply(Boom.badRequest(err)))
      return reply().code(204)
    })
  })
}
