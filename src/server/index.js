// @flow

import { Server } from 'ws'
import { find } from '../db'
import onError from './error'

const EVENTS = {
  MESSAGE: 'message',
  ERROR: 'error',
  CONNECTION: 'connection'
}

function send(ws, data): void {
  ws.send(JSON.stringify(data))
}

function findNodes(request, label, name, cb): void {
  find(label, { name }, (err, nodes) => {
    if (err) {
      throw err
    }
    cb(nodes)
  })
}

function onMessage(ws, data): void {
  const message = JSON.parse(data)
  const { request, label, name } = message

  if (request === 'node') {
    findNodes(request, label, name, (nodes) => send(ws, nodes))
  }
}

function newConnection(ws): void {
  ws.on(EVENTS.MESSAGE, data => onMessage(ws, data))
  ws.on(EVENTS.ERROR, onError)
}

function start(server: Server): void {
  server.on(EVENTS.CONNECTION, newConnection)
}

export default start
