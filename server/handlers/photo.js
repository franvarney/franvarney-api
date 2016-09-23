const Boom = require('boom')
const Flickr = require('flickrapi')
const Logger = require('franston')('handlers/photo')

const Config = require('../../config')

const options = {
  api_key: Config.flickr.key,
  secret: Config.flickr.secret
}

exports.getAll = function (request, reply) {
  Flickr.tokenOnly(options, (err, flickr) => { // TODO use authenticate method?
    if (err) return Logger.error(err), reply(Boom.badRequest(err))

    flickr.people.getPhotos({
      api_key: Config.flickr.key,
      user_id: Config.flickr.userId,
      // authenticated: true,
      page: request.query.page || 1,
      per_page: request.query.limit || 20
    }, (err, photos)  => {
      if (err) return Logger.error(err), reply(Boom.badRequest(err))
      if (photos.stat !== 'ok') return Logger.error(photos.stat), reply(Boom.badRequest(photos.stat))
      return reply(photos).code(200)
    })
  })
}
