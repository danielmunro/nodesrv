import { Server } from "ws"
import { Client } from "../client/client"
import { actions } from "../handler/actionCollection"
import { poll } from "../poll/poll"
import { Room } from "../room/model/room"
import { ImmediateTimer } from "../timer/immediateTimer"
import { SecondIntervalTimer } from "../timer/secondTimer"
import { ShortIntervalTimer } from "../timer/shortIntervalTimer"
import { Timer } from "../timer/timer"
import { EVENTS } from "./constants"
import { DecrementPlayerDelay } from "./observers/decrementPlayerDelay"
import { HandleClientRequests } from "./observers/handleClientRequests"
import { Observer } from "./observers/observer"

enum Status {
  Initialized,
  Started,
  Terminated,
}

export class GameServer {
  public readonly startRoom: Room
  private readonly wss: Server
  private status: Status = Status.Initialized
  private clients: Client[] = []

  constructor(wss, startRoom: Room) {
    this.wss = wss
    this.startRoom = startRoom
  }

  public start(): void {
    if (!this.isInitialized()) {
      throw new Error("Status must be initialized to start")
    }

    this.status = Status.Started
    this.wss.on(EVENTS.CONNECTION, this.addWS.bind(this))
    this.addObserver(new DecrementPlayerDelay(), new SecondIntervalTimer())
    this.addObserver(new HandleClientRequests(), new ShortIntervalTimer())
  }

  public terminate(): void {
    this.status = Status.Terminated
    this.wss.close()
  }

  public addWS(ws): void {
    const client = new Client(ws, actions, this.startRoom)
    this.clients.push(client)
    ws.onclose = () => this.removeClient(client)
    client.send({ message: client.session.getAuthStepMessage() })
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

  private removeClient(client: Client): void {
    console.info("client disconnected")
    this.clients = this.clients.filter((it) => it !== client)
    client.shutdown()
  }
}
