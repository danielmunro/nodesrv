import * as stringify from "json-stringify-safe"
import { HandlerCollection } from "../handler/handlerCollection"
import { HandlerDefinition } from "../handler/handlerDefinition"
import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import { getNewRequestFromMessageEvent, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { Room } from "../room/model/room"
import { default as AuthRequest } from "../session/auth/request"
import Session from "../session/session"
import { Channel } from "../social/constants"
import { Message } from "../social/message"
import { MESSAGE_NOT_UNDERSTOOD } from "./constants"

export function getDefaultUnhandledMessage() {
  return { message: MESSAGE_NOT_UNDERSTOOD }
}

export class Client {
  public readonly ws: WebSocket
  public readonly handlers: HandlerCollection
  public readonly session: Session
  public readonly startRoom: Room
  public player: Player
  private requests: Request[] = []

  constructor(ws: WebSocket, handlers: HandlerCollection, startRoom: Room = null) {
    this.ws = ws
    this.handlers = handlers
    this.startRoom = startRoom
    this.session = new Session(this)
    this.ws.onmessage = (data) => this.addRequest(getNewRequestFromMessageEvent(this.session.getPlayer(), data))
  }

  public createMessage(channel: Channel, message: string) {
    return new Message(this.player, channel, message)
  }

  public isOwnMessage(message: Message): boolean {
    return message.sender === this.player
  }

  public hasRequests(): boolean {
    return this.requests.length > 0
  }

  public addRequest(request: Request): void {
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
      await this.session.handleRequest(new AuthRequest(this, request.command))
      return
    }

    this.handleRequest(this.requests.shift())
  }

  public handleRequest(request: Request): Promise<any> {
    return this.handlers.getMatchingHandlerDefinitionForRequestType(
      request.requestType,
      this.getDefaultRequestHandler())
        .handle(request)
        .then((response) => {
          this.send(response)
          return response
        })
  }

  public send(data): void {
    this.ws.send(stringify(data))
  }

  public shutdown(): void {
    if (this.player) {
      this.player.closeSession()
    }
  }

  public tick(id: string, timestamp: Date) {
    this.send({ tick: { id, timestamp }})
  }

  private getDefaultRequestHandler(): HandlerDefinition {
    return new HandlerDefinition(RequestType.Any, () => new Promise((resolve) => resolve(getDefaultUnhandledMessage())))
  }
}
