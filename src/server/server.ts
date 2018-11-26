import getActionCollection from "../action/actionCollection"
import { Client } from "../client/client"
import GameService from "../gameService/gameService"
import ResetService from "../gameService/resetService"
import MobService from "../mob/mobService"
import MobTable from "../mob/mobTable"
import { getPlayerRepository } from "../player/repository/player"
import { Room } from "../room/model/room"
import { default as AuthService } from "../session/auth/service"
import { poll } from "../support/poll/poll"
import { ImmediateTimer } from "../timer/immediateTimer"
import { SecondIntervalTimer } from "../timer/secondTimer"
import { ShortIntervalTimer } from "../timer/shortIntervalTimer"
import { Timer } from "../timer/timer"
import { events } from "./constants"
import { DecrementPlayerDelay } from "./observers/decrementPlayerDelay"
import { HandleClientRequests } from "./observers/handleClientRequests"
import { Observer } from "./observers/observer"

enum Status {
  Initialized,
  Started,
  Terminated,
}

export class GameServer {
  private status: Status = Status.Initialized
  private clients: Client[] = []
  private authService: AuthService
  private actions

  constructor(
    public readonly wss,
    public readonly service: GameService,
    public readonly startRoom: Room,
    public readonly resetService: ResetService,
    public readonly mobService: MobService) {}

  public async start(): Promise<void> {
    if (!this.isInitialized()) {
      throw new Error("Status must be initialized to start")
    }

    this.authService = new AuthService(await getPlayerRepository())
    this.actions = await getActionCollection(this.service)
    this.status = Status.Started
    this.wss.on(events.connection, this.addWS.bind(this))
    this.addObserver(new DecrementPlayerDelay(), new SecondIntervalTimer())
    this.addObserver(new HandleClientRequests(), new ShortIntervalTimer())
  }

  public terminate(): void {
    this.status = Status.Terminated
    this.wss.close()
  }

  public async addWS(ws: WebSocket, req): Promise<void> {
    const client = new Client(
      ws,
      req ? req.connection.remoteAddress : null,
      this.actions,
      this.service,
      this.startRoom,
      this.authService,
      this.mobService.locationService)
    console.info("new client connected", { ip: client.ip })
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

  public getMobTable(): MobTable {
    return this.mobService.mobTable
  }

  private removeClient(client: Client): void {
    console.info("client disconnected", { ip: client.ip })
    this.clients = this.clients.filter((it) => it !== client)
    this.mobService.locationService.removeMob(client.getSessionMob())

  }
}
