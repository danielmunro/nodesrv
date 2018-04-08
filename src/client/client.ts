import * as stringify from "json-stringify-safe"
import { RequestType } from "./../handler/constants"
import { HandlerCollection } from "./../handler/handlerCollection"
import { HandlerDefinition } from "./../handler/handlerDefinition"
import { Player } from "./../player/model/player"
import { getNewRequestFromMessageEvent, Request } from "./../server/request/request"
import { Channel } from "./../social/constants"
import { Message } from "./../social/message"

export function getDefaultUnhandledMessage() {
  return { message: "what was that?" }
}

export class Client {
  public readonly ws: WebSocket
  public readonly player: Player
  public readonly handlers: HandlerCollection
  private requests: Request[] = []

  constructor(ws: WebSocket, player: Player, handlers: HandlerCollection) {
    this.ws = ws
    this.player = player
    this.handlers = handlers
    this.ws.onmessage = (data) => this.addRequest(getNewRequestFromMessageEvent(this.player, data))
    this.ws.onerror = (event) => console.log("error event", event)
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

  public canHandleRequests(): boolean {
    return this.hasRequests() && this.player.delay === 0
  }

  public handleNextRequest() {
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
    this.player.closeSession()
  }

  public tick(id: string, timestamp: Date) {
    this.send({ tick: { id, timestamp }})
  }

  private getDefaultRequestHandler(): HandlerDefinition {
    return new HandlerDefinition(RequestType.Any, () => new Promise((resolve) => resolve(getDefaultUnhandledMessage())))
  }
}
