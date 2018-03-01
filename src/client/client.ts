import { Player } from "./../player/player"
import { EVENTS } from "./../server/constants"
import onError from "./../server/error"
import { RequestType } from "./../server/handler/constants"
import { HandlerDefinition } from "./../server/handler/handlerDefinition"
import { handlers } from "./../server/handler/index"
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
    this.ws.onerror = (event) => onError(new Error())
  }

  public tick(id: string, timestamp: Date): void {
    this.send({ tick: { id, timestamp }})
  }

  public createMessage(channel: Channel, message: string) {
    return new Message(this.player, channel, message)
  }

  public isOwnMessage(message: Message): boolean {
    return message.sender === this.player
  }

  public sendMessage(message: Message): void {
    this.send({
      channel: message.channel,
      message: message.message,
      sender: message.sender.toString(),
    })
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
      .catch((e) => {
        console.log("exception in request promise", e)
        this.send({message: "Something bad happened."})
      })
  }

  private send(data): void {
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
    return new HandlerDefinition(RequestType.Any, () => getDefaultUnhandledMessage())
  }
}
