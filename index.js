import ws from 'ws'
import server from 'server'
import { PORT } from 'config'

server(new ws.Server({ port: PORT }))
