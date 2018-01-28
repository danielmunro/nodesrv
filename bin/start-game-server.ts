import { Server } from 'ws'
import start from './../src/server/index'
import { PORT } from './../src/config'

start(new Server({ port: PORT }))

console.log('server listening on port', PORT)
