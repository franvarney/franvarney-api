const Debug = require('debug')('jobs:get-swarm-checkins');
const Request = require('request');
const Series = require('run-series');
const Waterfall = require('run-waterfall');

const Config = require('../../config');
const DaysAgo = require('../helpers/days-ago');
const Place = require('../models/place');

const EPOCH = new Date('1970-01-01');

function saveCheckin (checkin, next) {
  Debug('saveCheckin');

  const query = {
    id: checkin.id
  };

  const options = {
    upsert: true,
    setDefaultsOnInsert: true
  };

  return Place.update(query, checkin, options, next);
}

function saveCheckins (checkins, done) {
  Debug('saveCheckins');

  Series(checkins.map((checkin) => {
    return saveCheckin.bind(null, checkin);
  }), (err) => {
    if (err) {
      Debug('save err', err);
      return done(err);
    }

    return done();
  });
}

function parseCheckins (checkins, done) {
  Debug('parseCheckins');

  const parsed = checkins.map(({ createdAt, id, shout, venue }) => {
    return {
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
      createdAt: new Date(EPOCH.setSeconds(EPOCH.getSeconds() + createdAt))
    };
  });

  return done(null, parsed);
}

function getCheckins (done) {
  Debug('getCheckins');

  const options = {
    url: 'https://api.foursquare.com/v2/users/self/checkins',
    method: 'GET',
    qs: {
      oauth_token: Config.foursquare.token,
      v: '20170508',
      m: 'swarm',
      limit: 100,
      afterTimestamp: Math.floor(DaysAgo(14) / 1000)
    },
    json: true
  };

  return Request(options, (err, response, body) => {
    if (err) {
      Debug('request err', err);
      return done(err);
    }

    if (response && response.statusCode !== 200) {
      Debug('response err', response);
      return done();
    }

    if (body && body.response.checkins.items.length) {
      return done(null, body.response.checkins.items);
    }

    return done();
  });
}

module.exports = function getSwarmCheckins () {
  Debug('Running job...');

  Waterfall([
    getCheckins,
    parseCheckins,
    saveCheckins
  ], (err) => {
    if (err) return Debug(err);
    return Debug('...completed!');
  });
};
