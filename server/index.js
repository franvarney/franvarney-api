import {Server} from 'hapi'

import Config from '../config'

let server = new Server()

server.connection({
  host: Config.env !== 'production' ? Config.host : null,
  port: parseInt(Config.port, 10)
})

server.start((err) => {
  if (err) throw err
  console.log(`Server starting at ${server.info.uri}`)
})

export default server
