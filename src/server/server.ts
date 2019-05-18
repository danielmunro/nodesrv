import {inject, injectable} from "inversify"
import {Server} from "ws"
import {Client} from "../client/client"
import ClientEvent from "../client/event/clientEvent"
import {EventType} from "../event/enum/eventType"
import EventService from "../event/eventService"
import {Room} from "../room/model/room"
import {poll} from "../support/poll/poll"
import {ImmediateTimer} from "../support/timer/immediateTimer"
import {Timer} from "../support/timer/timer"
import {Types} from "../support/types"
import ClientService from "./clientService"
import {events} from "./constants"
import {Observer} from "./observers/observer"

enum Status {
  Initialized,
  Started,
  Terminated,
}

@injectable()
export class GameServer {
  private status: Status = Status.Initialized

  constructor(
    @inject(Types.WebSocketServer) public readonly wss: Server,
    @inject(Types.StartRoom) public readonly startRoom: Room,
    @inject(Types.ClientService) public readonly clientService: ClientService,
    @inject(Types.EventService) public readonly eventService: EventService) {}

  public async start(): Promise<void> {
    if (!this.isInitialized()) {
      throw new Error("Status must be initialized to start")
    }
    this.status = Status.Started
    this.wss.on(events.connection, this.addWS.bind(this))
  }

  public terminate(): void {
    this.status = Status.Terminated
    this.wss.close()
  }

  public async addWS(ws: WebSocket, req: any): Promise<void> {
    const client = this.clientService.createNewClient(ws, req)
    console.info("new client connected", { ip: client.ip })
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
    poll(() => this.clientService.notifyClients(observer), timer)
    if (timer instanceof ImmediateTimer) {
      this.clientService.notifyClients(observer)
    }
  }

  public getClientCount(): number {
    return this.clientService.getClientCount()
  }

  private async removeClient(client: Client) {
    await this.eventService.publish(new ClientEvent(EventType.ClientDisconnected, client))
  }
}
