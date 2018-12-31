import * as stringify from "json-stringify-safe"
import { Collection } from "../action/definition/collection"
import CheckedRequest from "../check/checkedRequest"
import Cost from "../check/cost/cost"
import EventService from "../event/eventService"
import {EventType} from "../event/eventType"
import GameService from "../gameService/gameService"
import { Item } from "../item/model/item"
import MobEvent from "../mob/event/mobEvent"
import LocationService from "../mob/locationService"
import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import { Request } from "../request/request"
import RequestBuilder from "../request/requestBuilder"
import Response from "../request/response"
import { Room } from "../room/model/room"
import { default as AuthRequest } from "../session/auth/request"
import Session from "../session/session"
import { MESSAGE_NOT_UNDERSTOOD } from "./constants"

export function getDefaultUnhandledMessage(request: Request) {
  return request.respondWith().error(MESSAGE_NOT_UNDERSTOOD)
}

export class Client {
  public player: Player
  private requests = []

  constructor(
    public readonly session: Session,
    public readonly ws: WebSocket,
    public readonly ip: string,
    public readonly actionCollection: Collection,
    private readonly service: GameService,
    private readonly startRoom: Room,
    private readonly locationService: LocationService,
    private readonly eventService: EventService) {
    this.ws.onmessage = data => {
      const mobLocation = this.locationService.getLocationForMob(this.getSessionMob())
      this.addRequest(this.getNewRequestFromMessageEvent(mobLocation ? mobLocation.room : null, data))
    }
    this.ws.onerror = (error: ErrorEvent) =>
      console.warn("received error from client ws", { ip: this.ip, message: error.message })
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

  public getSessionMob(): Mob {
    return this.session.getMob()
  }

  public async handleNextRequest() {
    if (!this.session.isLoggedIn()) {
      const request = this.requests.shift() as AuthRequest
      const response = await this.session.handleRequest(this, request)
      if (this.session.isLoggedIn()) {
        await this.eventService.publish(new MobEvent(EventType.MobCreated, this.session.getMob()))
      }
      return response
    }

    return this.handleRequest(this.requests.shift())
  }

  public async handleRequest(request: Request): Promise<Response> {
    const matchingHandlerDefinition = this.actionCollection.getMatchingHandlerDefinitionForRequestType(
      request.getType(),
      request.getAuthorizationLevel())
    const response = await matchingHandlerDefinition.handle(request)
    if (response.request instanceof CheckedRequest) {
      this.applyCosts(response.request.check.costs)
    }
    this.send(response.getPayload())
    this.sendMessage(this.player.prompt())
    this.evaluateResponseAction(response)

    return response
  }

  public send(data): void {
    this.ws.send(stringify(data))
  }

  public sendMessage(message: string) {
    this.send({ message })
  }

  public tick(id: string, timestamp: Date) {
    this.send({ tick: { id, timestamp }})
  }

  public getStartRoom(): Room {
    return this.startRoom
  }

  private getNewRequestFromMessageEvent(room: Room, messageEvent: MessageEvent): Request | AuthRequest {
    const data = JSON.parse(messageEvent.data)
    if (!this.player) {
      return new AuthRequest(this, data.request)
    }
    const requestArgs = data.request.split(" ")
    const mob = this.player.sessionMob
    return new RequestBuilder(mob, room).create(requestArgs[0], data.request)
  }

  private applyCosts(costs: Cost[]): void {
    costs.forEach(cost => cost.applyTo(this.player))
  }

  private evaluateResponseAction(response: Response) {
    const responseAction = response.responseAction

    if (responseAction.wasItemCreated()) {
      this.service.itemService.add(responseAction.thing as Item)
      return
    }

    if (responseAction.wasItemDestroyed()) {
      this.service.itemService.remove(responseAction.thing as Item)
      return
    }
  }
}
