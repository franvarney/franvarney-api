const Debug = require('debug')('jobs/swarm-places')
const Request = require('request')
const Series = require('run-series')

const Config = require('../../config')
const DaysAgo = require('../helpers/days-ago')
const Place = require('../models/place')

function savePlace (place, next) {
  const options = {
    upsert: true,
    setDefaultsOnInsert: true
  }

  Place.update({ id: place.id }, place, options, (err) => {
    if (err) return (Debug(err), next(err))
    return next()
  })
}

function parsePlaces (body, done) {
  const places = body.map((place) => {
    const {createdAt, id, location, shout, venue} = place
    const epoch = new Date('1970-01-01')

    place = {
      id,
      location: {
        latitude: venue.location.lat,
        longitude: venue.location.lng
      },
      place: {
        id: venue.id,
        name: venue.name,
        type: 'Swarm'
      },
      visitor: {
        message: shout,
        name: 'Fran Varney'
      },
      isVisitor: false,
      createdAt: new Date(epoch.setSeconds(epoch.getSeconds() + createdAt))
    }

    return savePlace.bind(null, place)
  })

  return Series(places, done)
}

function getPlaces (done) {
  const options = {
    url: 'https://api.foursquare.com/v2/users/self/checkins',
    method: 'GET',
    qs: {
      oauth_token: Config.foursquare.token,
      v: '20161012',
      m: 'swarm',
      limit: 100,
      afterTimestamp: Math.floor(DaysAgo(14) / 1000)
    },
    json: true
  }

  Request(options, (err, response, body) => {
    if (err) return (Debug(err), done(err))

    if (response.statusCode === 200 && body.response.checkins.items.length) {
      parsePlaces(body.response.checkins.items, (err) => {
        if (err) return done(err)
        return done()
      })
    } else return done()
  })
}

module.exports = function getSwarmPlaces () {
  Debug('Running job...')

  getPlaces((err) => {
    if (err) return Debug(err)
    return Debug('...completed')
  })
}
