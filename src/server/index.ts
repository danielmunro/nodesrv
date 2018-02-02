import { v4 } from "uuid"
import { Server } from "ws"
import roll from "../dice"
import onError from "./error"
import { handlers } from "./handler/index"

const EVENTS = {
  CLOSE: "close",
  CONNECTION: "connection",
  ERROR: "error",
  MESSAGE: "message",
}

class GameServer {
  private static send(ws, data): void {
    ws.send(JSON.stringify(data))
  }

  private static onMessage(ws, data): void {
    const message = JSON.parse(data)
    const { request, label, name } = message

    if (handlers[request]) {
      handlers[request](label, name, (response) => GameServer.send(ws, response))
      return
    }

    GameServer.send(ws, {message: "what was that?"})
  }

  private wss: Server
  private ws: WebSocket[]
  private lastTimeout

  constructor(wss) {
    this.wss = wss
    this.ws = []
  }

  public start() {
    console.log("starting game server")
    this.wss.on(
      EVENTS.CONNECTION,
      this.newConnection.bind(this),
    )
    this.tick()
  }

  private tick() {
    // do tick stuff
    const identifier = v4()
    console.log("tick " + identifier + " called at " + new Date())
    for (const ws of this.ws) {
      // GameServer.send(ws, {event: "tick " + identifier})
      console.log("loop", ws)
    }

    if (this.lastTimeout) {
      clearTimeout(this.lastTimeout)
    }

    console.log("registering timeout")
    this.lastTimeout = setTimeout(() => {
      console.log("timeout")
      this.tick()
    }, 10000 * roll(1, 2))
  }

  private newConnection(ws) {
    ws.on(EVENTS.MESSAGE, (data) => GameServer.onMessage(ws, data))
    ws.on(EVENTS.ERROR, onError)
    ws.on(EVENTS.CLOSE, () => this.close(ws))
    this.ws.push(ws)
  }

  private close(ws) {
    this.ws = this.ws.filter((it) => it !== ws)
  }
}

export default GameServer
