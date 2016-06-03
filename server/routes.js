const Job = require('./handlers/job')
const Home = require('./handlers/home')
const Github = require('./handlers/github')
const Ping = require('./handlers/ping')
const Place = require('./handlers/place')
const Post = require('./handlers/post')

module.exports = [
  { method: 'GET', path: '/', config: { auth: false, handler: Home } },

  { method: 'GET', path: '/ping', config: { auth: false, handler: Ping } },

  { method: 'POST', path: '/jobs', config: Job.create },
  { method: 'GET', path: '/jobs/{id}', config: Job.get },
  { method: 'GET', path: '/jobs', config: Job.getAll },
  { method: 'DELETE', path: '/jobs/{id}', config: Job.remove },
  { method: 'PUT', path: '/jobs/{id}', config: Job.update },

  { method: 'GET', path: '/github/activities', config: Github.getAll },

  { method: 'GET', path: '/places/search', config: Place.search },

  { method: 'POST', path: '/posts', config: Post.create },
  { method: 'GET', path: '/posts/{slug}', config: Post.get },
  { method: 'GET', path: '/posts', config: Post.getAll },
  { method: 'DELETE', path: '/posts/{slug}', config: Post.remove },
  { method: 'PUT', path: '/posts/{slug}', config: Post.update }
]
