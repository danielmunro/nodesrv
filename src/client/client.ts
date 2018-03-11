import { Player } from "./../player/player"
import { RequestType } from "./../server/handler/constants"
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
  private readonly handlers: HandlerDefinition[]

  constructor(ws: WebSocket, player: Player, handlers: HandlerDefinition[]) {
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
    return this.getHandlerDefinitionMatchingRequest(request.requestType)
      .handle(request)
      .then((response) => {
        this.send(response)
        return response
      })
  }

  public send(data): void {
    this.ws.send(JSON.stringify(data))
  }

  private getHandlerDefinitionMatchingRequest(requestType: RequestType): HandlerDefinition {
    const handler = this.handlers.find((it) => it.isAbleToHandleRequestType(requestType))
    if (handler) {
      return handler
    }
    return this.getDefaultRequestHandler()
  }

  private getDefaultRequestHandler(): HandlerDefinition {
    return new HandlerDefinition(RequestType.Any, () => new Promise((resolve) => resolve(getDefaultUnhandledMessage())))
  }
}
