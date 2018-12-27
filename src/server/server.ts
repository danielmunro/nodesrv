import { Client } from "../client/client"
import createEventConsumerTable from "../event/eventConsumerTable"
import EventService from "../event/eventService"
import GameService from "../gameService/gameService"
import FightBuilder from "../mob/fight/fightBuilder"
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
import ClientService from "./clientService"
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
  public readonly clientService: ClientService
  private status: Status = Status.Initialized
  private authService: AuthService
  private actions

  constructor(
    public readonly wss,
    public readonly service: GameService,
    public readonly startRoom: Room,
    public readonly mobService: MobService) {
    this.clientService = new ClientService(mobService.locationService)
  }

  public async start(): Promise<void> {
    if (!this.isInitialized()) {
      throw new Error("Status must be initialized to start")
    }

    this.service.setEventService(
      new EventService(await createEventConsumerTable(
        this, this.mobService, this.service.itemService, new FightBuilder(this.service))))
    this.authService = new AuthService(await getPlayerRepository())
    this.actions = this.service.getActionCollection()
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
    this.clientService.add(client)
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
    poll(() => observer.notify(this.clientService.getClients()), timer)
    if (timer instanceof ImmediateTimer) {
      observer.notify(this.clientService.getClients())
    }
  }

  public getClientCount(): number {
    return this.clientService.getClientCount()
  }

  public getMobTable(): MobTable {
    return this.mobService.mobTable
  }

  private removeClient(client: Client): void {
    console.info("client disconnected", { ip: client.ip })
    this.clientService.remove(client)
    this.mobService.locationService.removeMob(client.getSessionMob())

  }
}
