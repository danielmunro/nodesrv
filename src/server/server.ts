import { v4 } from "uuid"
import { Server } from "ws"
import { Client } from "./../client/client"
import { savePlayers } from "./../player/model"
import { Player } from "./../player/player"
import { poll } from "./../poll"
import { Room } from "./../room/room"
import { Message } from "./../social/message"
import { EVENTS } from "./constants"
import { Observer } from "./observers/observer"
import { Timer } from "./timer/timer"
import { handlers } from "./handler";

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
  private observers: Observer[] = []

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

  public addObserver(observer: Observer, time: Timer): void {
    poll(() => observer.notify(this.clients), time)
  }

  private removeClient(client): void {
    this.clients = this.clients.filter((it) => it !== client)
  }
}
