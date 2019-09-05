import {IncomingMessage} from "http"
import {inject, injectable} from "inversify"
import {Server} from "ws"
import {Client} from "../../client/client"
import ClientService from "../../client/service/clientService"
import Socket from "../../client/socket"
import {EventType} from "../../event/enum/eventType"
import {createClientEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import {RoomEntity} from "../../room/entity/roomEntity"
import {poll} from "../../support/poll/poll"
import {ImmediateTimer} from "../../support/timer/immediateTimer"
import {Timer} from "../../support/timer/timer"
import {Types} from "../../support/types"
import {events} from "../constants"
import {GameServerStatus} from "../enum/gameServerStatus"
import {Observer} from "../observers/observer"

@injectable()
export class GameServerService {
  private status: GameServerStatus = GameServerStatus.Initialized

  constructor(
    @inject(Types.WebSocketServer) public readonly wss: Server,
    @inject(Types.StartRoom) public readonly startRoom: RoomEntity,
    @inject(Types.ClientService) public readonly clientService: ClientService,
    @inject(Types.EventService) public readonly eventService: EventService) {}

  public async start(): Promise<void> {
    if (!this.isInitialized()) {
      throw new Error("GameServerStatus must be initialized to start")
    }
    this.status = GameServerStatus.Started
    this.wss.on(events.connection, this.addWS.bind(this))
  }

  public terminate(): void {
    this.status = GameServerStatus.Terminated
    this.wss.close()
  }

  public async addWS(ws: WebSocket, req: IncomingMessage): Promise<void> {
    const client = this.clientService.createNewClient(new Socket(ws), req)
    console.info("new client connected", { ip: client.ip })
    ws.onclose = () => this.removeClient(client)
    client.sendMessage(client.session.getAuthStepMessage())
  }

  public isInitialized(): boolean {
    return this.status === GameServerStatus.Initialized
  }

  public isStarted(): boolean {
    return this.status === GameServerStatus.Started
  }

  public isTerminated(): boolean {
    return this.status === GameServerStatus.Terminated
  }

  public addObserver(observer: Observer, timer: Timer): void {
    poll(() => this.clientService.notifyClients(observer), timer)
    if (timer instanceof ImmediateTimer) {
      this.clientService.notifyClients(observer)
    }
  }

  public getClientCount(): number {
    return this.clientService.getClientCount()
  }

  private async removeClient(client: Client) {
    await this.eventService.publish(createClientEvent(EventType.ClientDisconnected, client))
  }
}
