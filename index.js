import ws from 'ws'
import server from 'server'
import { PORT } from 'constants'

server(new ws.Server({ port: PORT }))
