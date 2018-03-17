import * as stringify from "json-stringify-safe"
import { Player } from "./../player/model/player"
import { RequestType } from "./../server/handler/constants"
import { HandlerCollection } from "./../server/handler/handlerCollection"
import { HandlerDefinition } from "./../server/handler/handlerDefinition"
import { getNewRequestFromMessageEvent, Request } from "./../server/request/request"
import { Channel } from "./../social/constants"
import { Message } from "./../social/message"

export function getDefaultUnhandledMessage() {
  return { message: "what was that?" }
}

export class Client {
  private readonly ws: WebSocket
  private readonly player: Player
  private readonly handlers: HandlerCollection

  constructor(ws: WebSocket, player: Player, handlers: HandlerCollection) {
    this.ws = ws
    this.player = player
    this.handlers = handlers
    this.ws.onmessage = (data) => this.onRequest(getNewRequestFromMessageEvent(this.player, data))
    this.ws.onerror = (event) => console.log("error event", event)
  }

  public createMessage(channel: Channel, message: string) {
    return new Message(this.player, channel, message)
  }

  public isOwnMessage(message: Message): boolean {
    return message.sender === this.player
  }

  public getPlayer(): Player {
    return this.player
  }

  public onRequest(request: Request): Promise<any> {
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
    if (this.player.sessionMob && this.player.sessionMob.room) {
      this.player.sessionMob.room.removeMob(this.player.sessionMob)
    }
  }

  private getDefaultRequestHandler(): HandlerDefinition {
    return new HandlerDefinition(RequestType.Any, () => new Promise((resolve) => resolve(getDefaultUnhandledMessage())))
  }
}
