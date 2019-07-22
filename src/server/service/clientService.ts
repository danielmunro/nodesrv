import {inject, injectable} from "inversify"
import {Client} from "../../client/client"
import {MobEntity} from "../../mob/entity/mobEntity"
import LocationService from "../../mob/service/locationService"
import RequestBuilder from "../../request/builder/requestBuilder"
import Request from "../../request/request"
import Response from "../../request/response"
import {RoomEntity} from "../../room/entity/roomEntity"
import Email from "../../session/auth/authStep/login/email"
import {default as AuthRequest} from "../../session/auth/request"
import CreationService from "../../session/auth/service/creationService"
import SessionService from "../../session/service/sessionService"
import {Types} from "../../support/types"
import {Observer} from "../observers/observer"

@injectable()
export default class ClientService {
  constructor(
    @inject(Types.CreationService) private readonly creationService: CreationService,
    @inject(Types.LocationService) private readonly locationService: LocationService,
    private clients: Client[] = []) {}

  public createNewClient(ws: WebSocket, req: any) {
    const client = new Client(
      new SessionService(new Email(this.creationService)),
      ws,
      req ? req.connection.remoteAddress : null)
    this.add(client)
    ws.onmessage = message => this.onMessage(client, message)
    return client
  }

  public add(client: Client) {
    this.clients.push(client)
  }

  public remove(client: Client) {
    this.clients = this.clients.filter(c => c !== client)
  }

  public getClientByMob(mob: MobEntity): Client | undefined {
    return this.clients.find((client: Client) => client.getSessionMob() === mob)
  }

  public getClientCount(): number {
    return this.clients.length
  }

  public notifyClients(observer: Observer) {
    observer.notify(this.clients)
  }

  public sendMessageToMob(mob: MobEntity, message: string) {
    const client = this.clients.find(c => c.getSessionMob() === mob)
    if (client) {
      client.sendMessage(message)
    }
  }

  public sendMessageInRoom(mob: MobEntity, message: string): void {
    const mobs = this.getRoomMobs(mob)
    const clients = this.clients.filter(c => mobs.includes(c.getSessionMob()) && c.getSessionMob() !== mob)
    clients.forEach(c => c.sendMessage(message))
  }

  public sendResponseToRoom(response: Response): void {
    const mobs = this.getRoomMobs(response.getMob())
    const clients = this.clients.filter(c => mobs.includes(c.getSessionMob()))
    clients.forEach(client => {
      if (client.getSessionMob() === response.getMob()) {
        client.sendMessage(response.getMessageToRequestCreator())
      } else if (client.getSessionMob() === response.request.getMob()) {
        client.sendMessage(response.getMessageToTarget())
      } else {
        client.sendMessage(response.getMessageToObservers())
      }
    })
  }

  public sendMessage(mob: MobEntity, message: string): void {
    this.clients.forEach(c => {
      if (c.getSessionMob() !== mob) {
        c.sendMessage(message)
      }
    })
  }

  public getLoggedInMobs(): MobEntity[] {
    return this.clients.filter(client => client.isLoggedIn())
      .map(client => client.getSessionMob())
  }

  private getRoomMobs(mob: MobEntity): MobEntity[] {
    const location = this.locationService.getLocationForMob(mob)
    return this.locationService.getMobsByRoom(location.room)
  }

  private onMessage(client: Client, message: any) {
    try {
      const mobLocation = this.locationService.getLocationForMob(client.getSessionMob())
      client.addRequest(this.getNewRequestFromMessageEvent(client, message, mobLocation.room))
      return
    } catch (e) {
      // fine
    }
    client.addRequest(this.getNewRequestFromMessageEvent(client, message))
  }

  private getNewRequestFromMessageEvent(
    client: Client, messageEvent: MessageEvent, room?: RoomEntity): Request | AuthRequest {
    const data = JSON.parse(messageEvent.data)
    if (!client.player) {
      return new AuthRequest(client, data.request)
    }
    const requestArgs = data.request.split(" ")
    const mob = client.getSessionMob()
    return new RequestBuilder(this.locationService, mob, room).create(requestArgs[0], data.request)
  }
}
