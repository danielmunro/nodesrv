import { Server } from "ws"
import { Client } from "./../client/client"
import { Player } from "./../player/model/player"
import { poll } from "./../poll"
import { EVENTS } from "./constants"
import { handlers } from "./handler"
import { Observer } from "./observers/observer"
import { ImmediateTimer } from "./timer/immediateTimer"
import { Timer } from "./timer/timer"

enum Status {
  Initialized,
  Started,
  Terminated,
}

export class GameServer {
  private readonly wss: Server
  private readonly playerProvider: (name: string) => Player
  private status: Status = Status.Initialized
  private clients: Client[] = []

  constructor(wss, playerProvider: (name: string) => Player) {
    this.wss = wss
    this.playerProvider = playerProvider
  }

  public start(): void {
    if (!this.isInitialized()) {
      throw new Error("Status must be initialized to start")
    }

    this.status = Status.Started
    this.wss.on(EVENTS.CONNECTION, this.addWS.bind(this))
  }

  public terminate(): void {
    this.status = Status.Terminated
    this.wss.close()
  }

  public addWS(ws): void {
    const client = new Client(ws, this.playerProvider("demo name"), handlers)
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

  public addObserver(observer: Observer, timer: Timer): void {
    poll(() => observer.notify(this.clients), timer)
    if (timer instanceof ImmediateTimer) {
      observer.notify(this.clients)
    }
  }

  public getClientCount(): number {
    return this.clients.length
  }

  private removeClient(client): void {
    this.clients = this.clients.filter((it) => it !== client)
  }
}
