import { v4 } from "uuid"
import { Server } from "ws"
import roll from "../dice"
import { Client } from "./client"
import { EVENTS } from "./constants"
import { Timer } from "./timer/timer"

enum Status {
  Initialized,
  Started,
  Terminated,
}

export class GameServer {
  private status: Status = Status.Initialized
  private wss: Server
  private clients: Client[] = []
  private timer: Timer

  constructor(wss) {
    this.wss = wss
  }

  public start(timer): void {
    if (!this.isInitialized()) {
      throw new Error("Status must be initialized to start")
    }

    this.status = Status.Started
    this.timer = timer
    this.wss.on(EVENTS.CONNECTION, this.addWS.bind(this))
    this.registerTickTimeout()
  }

  public terminate(): void {
    if (!this.isStarted()) {
      throw new Error("Status must be started to terminate")
    }

    this.status = Status.Terminated
  }

  public addWS(ws): void {
    const client = new Client(ws)
    this.clients.push(client)
    ws.onclose = () => this.removeClient(client)
  }

  public isInitialized(): boolean {
    return this.status === Status.Initialized
  }

  public isStarted(): boolean {
    return this.status === Status.Started
  }

  public isTerminated(): boolean {
    return this.status === Status.Terminated
  }

  private registerTickTimeout(): void {
    setTimeout(
      this.tick.bind(this),
      this.timer.getRandomTickLength(),
    )
  }

  private tick(): void {
    const id = v4()
    const timestamp = new Date()
    const payload = {tick: { id, timestamp }}

    this.clients.map((it) => it.send(payload))

    if (this.isStarted()) {
      this.registerTickTimeout()
    }
  }

  private removeClient(client): void {
    this.clients = this.clients.filter((it) => it !== client)
  }
}
