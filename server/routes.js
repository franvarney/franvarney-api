const Job = require('./handlers/job')
const JobSchema = require('./schemas/job')
const Home = require('./handlers/home')
const Github = require('./handlers/github')
const Ping = require('./handlers/ping')
const Place = require('./handlers/place')
const Post = require('./handlers/post')

module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      auth: false,
      handler: Home
    }
  },

  {
    method: 'GET',
    path: '/ping',
    config: {
      auth: false,
      handler: Ping
    }
  },

  {
    method: 'GET',
    path: '/github/activities',
    config: {
      auth: false,
      handler: Github.getAll
    }
  },

  {
    method: 'POST',
    path: '/jobs',
    config: {
      validate: {
        payload: JobSchema.create,
      },
      handler: Job.create
    }
  },

  {
    method: 'GET',
    path: '/jobs/{id}',
    config: {
      auth: false,
      handler: Job.get
    }
  },

  {
    method: 'GET',
    path: '/jobs',
    config: {
      auth: false,
      validate: {
        query: JobSchema.getAllQuery
      },
      handler: Job.getAll
    }
  },

  {
    method: 'DELETE',
    path: '/jobs/{id}',
    config: {
      handler: Job.remove
    }
  },

  {
    method: 'PUT',
    path: '/jobs/{id}',
    config: {
      validate: {
        payload: JobSchema.update
      },
      handler: Job.update
    }
  },

  {
    method: 'POST',
    path: '/places',
    config: Place.create
  },

  {
    method: 'DELETE',
    path: '/places/{id}',
    config: {
      handler: Place.delete
    }
  },

  {
    method: 'GET',
    path: '/places',
    config: Place.getAll
  },

  {
    method: 'GET',
    path: '/places/search',
    config: Place.search
  },

  {
    method: 'PUT',
    path: '/places/{id}',
    config: {
      handler: Place.update
    }
  },

  {
    method: 'POST',
    path: '/posts',
    config: Post.create
  },

  {
    method: 'GET',
    path: '/posts/{slug}',
    config: Post.get
  },

  {
    method: 'GET',
    path: '/posts',
    config: Post.getAll
  },

  {
    method: 'DELETE',
    path: '/posts/{slug}',
    config: Post.remove
  },

  {
    method: 'PUT',
    path: '/posts/{slug}',
    config: Post.update
  }
]
