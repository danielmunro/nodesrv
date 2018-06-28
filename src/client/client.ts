import * as stringify from "json-stringify-safe"
import { Collection } from "../handler/definition/collection"
import { Definition } from "../handler/definition/definition"
import { Mob } from "../mob/model/mob"
import { Player } from "../player/model/player"
import { getNewRequestFromMessageEvent, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import Response from "../request/response"
import { ResponseStatus } from "../request/responseStatus"
import { Room } from "../room/model/room"
import { default as AuthRequest } from "../session/auth/request"
import Session from "../session/session"
import { Channel } from "../social/constants"
import { Message } from "../social/message"
import { MESSAGE_NOT_UNDERSTOOD } from "./constants"

export function getDefaultUnhandledMessage(request: Request) {
  return new Response(request, ResponseStatus.PreconditionsFailed, MESSAGE_NOT_UNDERSTOOD)
}

export class Client {
  public readonly session: Session
  public player: Player
  private requests: Request[] = []

  constructor(
    public readonly ws: WebSocket,
    public readonly ip: string,
    public readonly handlers: Collection,
    public readonly startRoom: Room = null) {
    this.session = new Session(this)
    this.ws.onmessage = (data) => this.addRequest(getNewRequestFromMessageEvent(this.session.getPlayer(), data))
    this.ws.onerror = (error: ErrorEvent) =>
      console.warn("received error from client ws", { ip: this.ip, message: error.message })
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

    await this.handleRequest(this.requests.shift())
  }

  public handleRequest(request: Request): Promise<any> {
    return this.handlers.getMatchingHandlerDefinitionForRequestType(
      request.requestType,
      this.getDefaultRequestHandler(request))
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

  private getDefaultRequestHandler(request: Request): Definition {
    return new Definition(RequestType.Any, () => Promise.resolve(getDefaultUnhandledMessage(request)))
  }
}
