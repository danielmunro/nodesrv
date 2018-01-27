// @flow

import ws from 'ws'
import start from './../src/server'
import { PORT } from './../src/config'

start(new ws.Server({ port: PORT }))

console.log('server listening on port', PORT)
