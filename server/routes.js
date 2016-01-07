import Job from './handlers/job'
import Ping from './handlers/ping'

export default [
  { method: 'GET', path: '/ping', config: { auth: false, handler: Ping } },

  { method: 'POST', path: '/jobs', config: Job.create },
  { method: 'GET', path: '/jobs/{id}', config: Job.get },
  { method: 'GET', path: '/jobs', config: Job.getAll },
  { method: 'DELETE', path: '/jobs/{id}', config: Job.remove }
]
