import Job from './handlers/job'
import Home from './handlers/home'
import Github from './handlers/github'
import Ping from './handlers/ping'
import Post from './handlers/post'

export default [
  { method: 'GET', path: '/', config: { auth: false, handler: Home } },

  { method: 'GET', path: '/ping', config: { auth: false, handler: Ping } },

  { method: 'POST', path: '/jobs', config: Job.create },
  { method: 'GET', path: '/jobs/{id}', config: Job.get },
  { method: 'GET', path: '/jobs', config: Job.getAll },
  { method: 'DELETE', path: '/jobs/{id}', config: Job.remove },
  { method: 'PUT', path: '/jobs/{id}', config: Job.update },

  { method: 'GET', path: '/github/activities', config: Github.getAll },

  { method: 'POST', path: '/posts', config: Post.create }
]
