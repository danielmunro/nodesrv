import { Player } from "./../player/player"
import { EVENTS } from "./../server/constants"
import onError from "./../server/error"
import { handlers } from "./../server/handler/index"
import { Request } from "./../server/handler/request"
import { Message } from "./../social/message"

export class Client {
  private ws: WebSocket
  private player: Player = new Player(this)

  constructor(ws: WebSocket) {
    this.ws = ws
    this.ws.onmessage = (data) => this.onMessage(data)
    this.ws.onerror = (event) => onError(new Error())
  }

  public send(data): void {
    this.ws.send(JSON.stringify(data))
  }

  public getNewHandlerFromEvent(messageEvent: MessageEvent): Request {
    let message

    try {
      message = JSON.parse(messageEvent.data)
    } catch (e) {
      console.log("error parsing message from client", messageEvent.data)
      return
    }

    return new Request(this.player, message.request, message)
  }

  public isOwnMessage(message: Message): boolean {
    return message.getSender() === this.player
  }

  public sendMessage(message: Message): void {
    this.send({
      channel: message.getChannel(),
      message: message.getMessage(),
      sender: message.getSender().toString(),
    })
  }

  public getPlayer(): Player {
    return this.player
  }

  public close(): void {
    this.ws.close()
  }

  private onMessage(messageEvent: MessageEvent): void {
    this.getNewHandlerFromEvent(messageEvent).applyHandlerDefinitionsToRequest(
      handlers,
      (response) => this.send(response),
      () => this.send({message: "what was that?"}),
    )
  }
}
