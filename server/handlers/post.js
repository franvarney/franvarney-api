const Boom = require('boom')
const Logger = require('franston')('handlers/post')
const Slug = require('slug')

const DateSort = require('../helpers/date-sort')
const Post = require('../models/blog/post')

exports.create = function (request, reply) {
  let {caption, content, image, summary, tags, title} = request.payload

  let newPost = {
    title,
    slug: Slug(title, { lower: true }),
    image,
    caption,
    summary,
    content,
    tags
  }

  new Post(newPost).save((err, created) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err.message)))

    Post.update(
      { slug: { $ne: created.slug } },
      { latest: false },
      { multi: true },
      (err, count) => {
        if (err) return (Logger.error(err), reply(Boom.badRequest(err.message)))
        return /* Logger.debug(created), */ reply(created)
      })
  })
}

exports.get = function (request, reply) {
  Post.findOne({ slug: request.params.slug }, (err, post) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err.message)))
    return /* Logger.debug(post), */ reply(post)
  })
}

exports.getAll = function (request, reply) {
  let query = request.query && request.query.latest ? { latest: true } : {}

  Post.find(query, (err, posts) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err.message)))

    posts.sort(DateSort.bind(null, 1))
    return /* Logger.debug(posts), */ reply(posts)
  })
}

exports.remove = function (request, reply) {
  Post.remove({ slug: request.params.slug }, (err) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err.message)))
    return /* Logger.debug(request.params.slug), */ reply()
  })
}

exports.update = function (request, reply) {
  let {params, payload} = request

  Post.update({ slug: params.slug }, payload, (err) => {
    if (err) return (Logger.error(err), reply(Boom.badRequest(err.message)))
    return /* Logger.debug(params.slug), */ reply(params.slug)
  })
}
