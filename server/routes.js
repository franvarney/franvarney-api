import Ping from './handlers/ping'

export default [
  { method: 'GET', path: '/ping', config: { auth: false, handler: Ping } }
]
