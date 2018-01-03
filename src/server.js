import { DOMAINS } from './constants'

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
  if (e.code !== 'ECONNRESET') {
    console.log('error', e)
  }
}

function onMessage (ws, data) {
  const message = JSON.parse(data)

  if (message.request === 'node' && message.label === DOMAINS.room) {
    const model = {
      id: 'abc-1234567890',
      model: DOMAINS.room,
      type: 'state',
      name: 'the starting room',
      description: 'this is the start',
      tiles: [
        [{x: 0, y: 15}, {x: 0, y: 15}, {x: 1, y: 15}],
        [{x: 0, y: 15}, {x: 0, y: 15}, {x: 0, y: 15}],
        [{x: 5, y: 15}, {x: 0, y: 15}, {x: 0, y: 15}]
      ],
      rels: []
    }
    send(ws, model)
    return
  }

  if (message.request === 'node' && message.label === 'player') {
    const model = {
      id: 'chu3npr30pc30p3',
      model: 'player',
      type: 'state',
      data: {
        room: 'abc-1234567890',
        name: 'one eyed pete'
      },
      rels: ['abc-1234567890']
    }
    send(ws, model)
  }
}
