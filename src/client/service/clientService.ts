import {IncomingMessage} from "http"
import {inject, injectable} from "inversify"
import RequestBuilder from "../../messageExchange/builder/requestBuilder"
import { default as MessageExchangeRequest } from "../../messageExchange/request"
import Response from "../../messageExchange/response"
import {MobEntity} from "../../mob/entity/mobEntity"
import LocationService from "../../mob/service/locationService"
import {RoomEntity} from "../../room/entity/roomEntity"
import {Observer} from "../../server/observers/observer"
import Email from "../../session/auth/authStep/login/email"
import CreationService from "../../session/auth/service/creationService"
import Session from "../../session/session"
import Maybe from "../../support/functional/maybe/maybe"
import {Types} from "../../support/types"
import {Client} from "../client"
import Socket from "../socket"

@injectable()
export default class ClientService {
  constructor(
    @inject(Types.CreationService) private readonly creationService: CreationService,
    @inject(Types.LocationService) private readonly locationService: LocationService,
    private clients: Client[] = []) {}

  public createNewClient(socket: Socket, req: IncomingMessage) {
    const client = new Client(
      new Session(new Email(this.creationService)),
      socket,
      req.connection.remoteAddress as string)
    this.add(client)
    socket.onMessage(message => this.onMessage(client, message))
    return client
  }

  public add(client: Client) {
    this.clients.push(client)
  }

  public remove(client: Client) {
    this.clients = this.clients.filter(c => c !== client)
  }

  public getClientByMob(mob: MobEntity): Client | undefined {
    return this.clients.find((client: Client) => client.getSessionMob() && mob.is(client.getSessionMob()))
  }

  public getClientCount(): number {
    return this.clients.length
  }

  public notifyClients(observer: Observer) {
    observer.notify(this.clients)
  }

  public sendMessageToMob(mob: MobEntity, message: string) {
    Maybe.if(this.clients.find(c => c.getSessionMob() === mob), client => client.sendMessage(message))
  }

  public sendMessageInRoom(mob: MobEntity, message: string): void {
    const mobs = this.getRoomMobs(mob)
    this.clients.filter(c => mobs.includes(c.getSessionMob()) && !c.getSessionMob().is(mob))
      .forEach(c => c.sendMessage(message))
  }

  public sendResponseToRoom(response: Response): void {
    const mobs = this.getRoomMobs(response.getMob())
    this.clients.filter(c => mobs.includes(c.getSessionMob()))
      .forEach(client => {
        if (client.getSessionMob().is(response.getMob())) {
          client.sendMessage(response.getMessageToRequestCreator())
          return
        }
        if (client.getSessionMob().is(response.request.getTargetMobInRoom())) {
          client.sendMessage(response.getMessageToTarget())
          return
        }
        client.sendMessage(response.getMessageToObservers())
    })
  }

  public sendMessage(mob: MobEntity, message: string): void {
    this.clients.filter(c => !c.getSessionMob().is(mob)).forEach(c => c.sendMessage(message))
  }

  public getLoggedInMobs(): MobEntity[] {
    return this.getLoggedInClients().map(client => client.getSessionMob())
  }

  private getRoomMobs(mob: MobEntity): MobEntity[] {
    const location = this.locationService.getLocationForMob(mob)
    return this.locationService.getMobsByRoom(location.room)
  }

  private onMessage(client: Client, message: any) {
    const mob = client.getSessionMob()
    Maybe.if(mob, () => {
      client.addRequest(
        this.getNewRequestFromMessageEvent(mob, message, this.locationService.getRoomForMob(mob)))
    }).or(() => client.addRequest(this.getNewRequestFromMessageEvent(mob, message)))
      .get()
  }

  private getNewRequestFromMessageEvent(
    mob: MobEntity, messageEvent: MessageEvent, room?: RoomEntity): MessageExchangeRequest {
    const data = JSON.parse(messageEvent.data)
    const requestArgs = data.request.split(" ")
    return new RequestBuilder(this.locationService, mob, room).create(requestArgs[0], data.request)
  }

  private getLoggedInClients(): Client[] {
    return this.clients.filter(c => c.isLoggedIn())
  }
}
