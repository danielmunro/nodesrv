import { Server } from "ws"
import onError from "./error"
import { handlers } from "./handler/index"

const EVENTS = {
  CONNECTION: "connection",
  ERROR: "error",
  MESSAGE: "message",
}

function send(ws, data): void {
  ws.send(JSON.stringify(data))
}

function onMessage(ws, data): void {
  const message = JSON.parse(data)
  const { request, label, name } = message

  if (handlers[request]) {
    handlers[request](label, name, (nodes) => send(ws, nodes))
    return
  }

  send(ws, {message: "what was that?"})
}

function newConnection(ws): void {
  ws.on(EVENTS.MESSAGE, (data) => onMessage(ws, data))
  ws.on(EVENTS.ERROR, onError)
}

function start(server: Server): void {
  server.on(EVENTS.CONNECTION, newConnection)
}

export default start
