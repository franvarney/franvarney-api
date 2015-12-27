import Ping from './handlers/ping'

export default [
  { method: 'GET', path: '/ping', handler: Ping }
]
