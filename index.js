import ws from 'ws'
import server from './src/server'
import { PORT } from './src/constants'

server(new ws.Server({ port: PORT }))
