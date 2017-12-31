const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 5151 })

class Server {
  constructor(wss) {
    this.wss = wss
    this.start = this.start.bind(this)
    this.newConnection = this.newConnection.bind(this)
    this.send = this.send.bind(this)
  }
  start() {
    this.wss.on('connection', this.newConnection)
  }
  newConnection(ws) {
    ws.on('message', (data) => this.onMessage(ws, data))
    ws.on('error', this.onError)
  }
  send(ws, data) {
    ws.send(JSON.stringify(data))
  }
  onError() {
    console.log('error')
  }
  onMessage(ws, data) {
    console.log('received: %s', data)
    const message = JSON.parse(data)
    if (message.request == 'getRoom') {
      const model = {
        id: 'abc-1234567890',
        model: 'room',
        type: 'state',
        name: 'the starting room',
        description: 'this is the start',
        tiles: [
          [{x: 0, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}],
          [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 0}],
          [{x: 1, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
        ],
        rels: []
      }
      sendModel(ws, model)
      return
    }

    if (message.request == 'getPlayer') {
      const model = {
        id: 'chu3npr30pc30p3',
        model: 'player',
        type: 'state',
        data: {
          room: 'abc-1234567890',
          name: 'one eyed pete',
        },
        rels: ['abc-1234567890']
      }
      sendModel(ws, model)
      return
    }
  }
}

const sendModel = (ws, model) => {
  console.log('writing', model)
  ws.send(JSON.stringify(model))
}

const server = new Server(wss)
server.start()
