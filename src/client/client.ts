import * as stringify from "json-stringify-safe"
import { Collection } from "../action/definition/collection"
import { Definition } from "../action/definition/definition"
import CheckedRequest from "../check/checkedRequest"
import Cost from "../check/cost/cost"
import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import Table from "../mob/table"
import { Player } from "../player/model/player"
import { getNewRequestFromMessageEvent, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import Response from "../request/response"
import ResponseAction from "../request/responseAction"
import { Room } from "../room/model/room"
import Service from "../service/service"
import Email from "../session/auth/login/email"
import { default as AuthRequest } from "../session/auth/request"
import { default as AuthService } from "../session/auth/service"
import Session from "../session/session"
import { Channel } from "../social/channel"
import { Message } from "../social/message"
import { MESSAGE_NOT_UNDERSTOOD } from "./constants"

export function getDefaultUnhandledMessage(request: Request) {
  return request.respondWith().error(MESSAGE_NOT_UNDERSTOOD)
}

export class Client {
  public player: Player
  private session: Session
  private requests = []

  constructor(
    public readonly ws: WebSocket,
    public readonly ip: string,
    public readonly handlers: Collection,
    private readonly service: Service,
    private readonly startRoom: Room,
    private readonly authService: AuthService) {
    this.session = new Session(this, new Email(this.authService))
    this.ws.onmessage = (data) => this.addRequest(getNewRequestFromMessageEvent(this, data))
    this.ws.onerror = (error: ErrorEvent) =>
      console.warn("received error from client ws", { ip: this.ip, message: error.message })
  }

  public createMessage(channel: Channel, message: string) {
    return new Message(this.player.sessionMob, channel, message)
  }

  public isOwnMessage(message: Message): boolean {
    return message.sender.uuid === this.player.sessionMob.uuid
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
      const request = this.requests.shift()
      return this.session.handleRequest(new AuthRequest(this, request.input))
    }

    return this.handleRequest(this.requests.shift())
  }

  public async handleRequest(request: Request): Promise<Response> {
    const matchingHandlerDefinition = this.handlers.getMatchingHandlerDefinitionForRequestType(
      request.requestType,
      request.getAuthorizationLevel(),
      this.getDefaultRequestHandler(request))
    const response = await matchingHandlerDefinition.handle(request)
    if (response.request instanceof CheckedRequest) {
      this.applyCosts(response.request.check.costs)
    }
    this.send(response)
    this.sendMessage(this.player.prompt())
    this.evaluateResponseAction(response.responseAction)

    return response
  }

  public send(data): void {
    this.ws.send(stringify(data))
  }

  public sendMessage(message: string) {
    this.send({ message })
  }

  public shutdown(): void {
    if (this.player) {
      this.player.closeSession()
    }
  }

  public tick(id: string, timestamp: Date) {
    this.send({ tick: { id, timestamp }})
  }

  public getStartRoom(): Room {
    return this.startRoom
  }

  public getMobTable(): Table {
    return this.service.mobTable
  }

  private applyCosts(costs: Cost[]): void {
    costs.forEach(cost => cost.applyTo(this.player))
  }

  private evaluateResponseAction(responseAction: ResponseAction) {
    if (responseAction.wasItemCreated()) {
      this.service.itemTable.add(responseAction.thing as Item)
      return
    }

    if (responseAction.wasItemDestroyed()) {
      this.service.itemTable.remove(responseAction.thing as Item)
      return
    }
  }

  private getDefaultRequestHandler(request: Request): Definition {
    return new Definition(this.service, RequestType.Any, () => Promise.resolve(getDefaultUnhandledMessage(request)))
  }
}
