import { find } from '../db'
import { ws as WebSocket } from 'ws'

const ERROR_CONNECTION_RESET = 'read ECONNRESET'

export default function (ws: WebSocket) {
  ws.on('connection', newConnection)
}

function newConnection (ws: WebSocket) {
  ws.on('message', data => onMessage(ws, data))
  ws.on('error', onError)
}

function send (ws: WebSocket, data: object) {
  ws.send(JSON.stringify(data))
}

function onError (e: Error) {
  if (e.message !== ERROR_CONNECTION_RESET) {
    console.log('error', e)
  }
}

function onMessage (ws: WebSocket, data: string) {
  const message = JSON.parse(data)
  const { request, label, name } = message

  if (request === 'node') {
    find(label, { name }, (err, models) => {
      if (err) {
        throw err
      }
      send(ws, models)
    })
  }
}
