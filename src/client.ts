import { Player } from "./player/player"
import { Message } from "./social/message"
import { EVENTS } from "./server/constants"
import onError from "./server/error"
import { handlers } from "./server/handler/index"
import { MessageHandler } from "./server/handler/messageHandler"

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

  public getNewHandlerFromEvent(messageEvent: MessageEvent): MessageHandler {
    let message

    try {
      message = JSON.parse(messageEvent.data)
    } catch (e) {
      console.log("error parsing message from client", messageEvent.data)
      return
    }

    return new MessageHandler(this.player, message.request, message)
  }

  public isMessageSender(message: Message): boolean {
    return message.getSender() === this.player
  }

  public sendMessage(message: Message): void {
    this.send({
      channel: message.getChannel(),
      message: message.getMessage(),
      sender: message.getSender().toString(),
    })
  }

  private onMessage(messageEvent: MessageEvent): void {
    this.getNewHandlerFromEvent(messageEvent).applyHandlers(
      handlers,
      (response) => this.send(response),
      () => this.send({message: "what was that?"}),
    )
  }
}
