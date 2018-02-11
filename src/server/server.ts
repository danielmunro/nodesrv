import { v4 } from "uuid"
import { Server } from "ws"
import roll from "../dice"
import { Client } from "./../client/client"
import { saveModels } from "./../player/model"
import { Player } from "./../player/player"
import { Room } from "./../room/room"
import { Message } from "./../social/message"
import { EVENTS } from "./constants"
import { Timer } from "./timer/timer"

enum Status {
  Initialized,
  Started,
  Terminated,
}

export class GameServer {
  private wss: Server
  private timer: Timer
  private status: Status = Status.Initialized
  private clients: Client[] = []
  private playerProvider: (name: string) => Player
  private readMessages: () => Message[]

  constructor(
    wss,
    timer,
    readMessages: () => Message[],
    playerProvider: (name: string) => Player,
  ) {
    this.wss = wss
    this.timer = timer
    this.readMessages = readMessages
    this.playerProvider = playerProvider
  }

  public start(): void {
    if (!this.isInitialized()) {
      throw new Error("Status must be initialized to start")
    }

    this.status = Status.Started
    this.wss.on(EVENTS.CONNECTION, this.addWS.bind(this))
    this.registerTickTimeout()
    this.registerChatTimeout()
  }

  public terminate(): void {
    if (!this.isStarted()) {
      throw new Error("Status must be started to terminate")
    }

    this.status = Status.Terminated
    this.clients.map((client) => client.close())
  }

  public addWS(ws): void {
    const client = new Client(ws, this.playerProvider("demo name"))
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

  private chat(): void {
    this.broadcastMessagestoClients()

    if (this.isStarted()) {
      this.registerChatTimeout()
    }
  }

  private registerChatTimeout(): void {
    setTimeout(this.chat.bind(this), 100)
  }

  private tick(): void {
    const id = v4()
    const timestamp = new Date()

    saveModels(this.clients.map((it) => it.getPlayer().getModel()))
    this.clients.map((it) => it.tick(id, timestamp))

    if (this.isStarted()) {
      this.registerTickTimeout()
    }
  }

  private registerTickTimeout(): void {
    setTimeout(this.tick.bind(this), this.timer.getRandomTickLength())
  }

  private removeClient(client): void {
    this.clients = this.clients.filter((it) => it !== client)
  }

  private broadcastMessagestoClients(): void {
    this.readMessages().forEach((message) =>
      this.clients.forEach((client) =>
        this.sendToClientIfNotSender(client, message)))
  }

  private sendToClientIfNotSender(client: Client, message: Message): void {
    if (!client.isOwnMessage(message)) {
      client.sendMessage(message)
    }
  }
}
