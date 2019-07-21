// @ts-ignore
import * as stringify from "json-stringify-safe"
import Action from "../action/impl/action"
import { MobEntity } from "../mob/entity/mobEntity"
import LocationService from "../mob/service/locationService"
import { PlayerEntity } from "../player/entity/playerEntity"
import RequestBuilder from "../request/builder/requestBuilder"
import Request from "../request/request"
import { RoomEntity } from "../room/entity/roomEntity"
import { default as AuthRequest } from "../session/auth/request"
import SessionService from "../session/service/sessionService"

export class Client {
  public player: PlayerEntity
  private requests: any = []

  constructor(
    public readonly session: SessionService,
    public readonly ws: WebSocket,
    public readonly ip: string,
    private readonly actions: Action[],
    private readonly locationService: LocationService) {
    this.ws.onmessage = this.onMessage.bind(this)
  }

  public hasRequests(): boolean {
    return this.requests.length > 0
  }

  public addRequest(request: Request | AuthRequest): void {
    this.requests.push(request)
  }

  public isLoggedIn(): boolean {
    return this.session.isLoggedIn()
  }

  public canHandleRequests(): boolean {
    if (!this.isLoggedIn()) {
      return this.hasRequests()
    }

    return this.hasRequests() && this.player.delay === 0
  }

  public getSessionMob(): MobEntity {
    return this.session.getMob()
  }

  public getNextRequest(): Request {
    return this.requests.shift()
  }

  public send(data: any): void {
    this.ws.send(stringify(data))
  }

  public sendMessage(message: string) {
    this.send({ message })
  }

  public tick(id: string, timestamp: Date) {
    this.send({ tick: { id, timestamp }})
  }

  private onMessage(message: any) {
    try {
      const mobLocation = this.locationService.getLocationForMob(this.getSessionMob())
      this.addRequest(this.getNewRequestFromMessageEvent(message, mobLocation.room))
      return
    } catch (e) {
      // fine
    }
    this.addRequest(this.getNewRequestFromMessageEvent(message))
  }

  private getNewRequestFromMessageEvent(messageEvent: MessageEvent, room?: RoomEntity): Request | AuthRequest {
    const data = JSON.parse(messageEvent.data)
    if (!this.player) {
      return new AuthRequest(this, data.request)
    }
    const requestArgs = data.request.split(" ")
    const mob = this.player.sessionMob
    return new RequestBuilder(this.actions, this.locationService, mob, room).create(requestArgs[0], data.request)
  }
}
