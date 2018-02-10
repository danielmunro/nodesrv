import { Player } from "./../player/player"
import { EVENTS } from "./../server/constants"
import onError from "./../server/error"
import { handlers } from "./../server/handler/index"
import { Request } from "./../server/request/request"
import { Message } from "./../social/message"

export class Client {
  private ws: WebSocket
  private player: Player

  constructor(ws: WebSocket, player: Player) {
    this.ws = ws
    this.player = player
    this.ws.onmessage = (data) => this.onMessage(data)
    this.ws.onerror = (event) => onError(new Error())
  }

  public tick(id: string, timestamp: Date): void {
    this.send({ tick: { id, timestamp }})
  }

  public getNewRequestFromEvent(messageEvent: MessageEvent): Request {
    const message = JSON.parse(messageEvent.data)

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

  private send(data): void {
    this.ws.send(JSON.stringify(data))
  }

  private onMessage(messageEvent: MessageEvent): void {
    this.getNewRequestFromEvent(messageEvent).applyHandlerDefinitionsToRequest(
      handlers,
      (response) => this.send(response),
      () => this.send({message: "what was that?"}),
    )
  }
}
