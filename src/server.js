import { find } from 'model'

const ERROR_CONNECTION_RESET = 'ECONNRESET'

export default function (wss) {
  wss.on('connection', newConnection)
}

function newConnection (ws) {
  ws.on('message', data => onMessage(ws, data))
  ws.on('error', onError)
}

function send (ws, data) {
  ws.send(JSON.stringify(data))
}

function onError (e) {
  if (e.code !== ERROR_CONNECTION_RESET) {
    console.log('error', e)
  }
}

function onMessage (ws, data) {
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
