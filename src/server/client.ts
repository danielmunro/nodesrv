import { EVENTS } from "./constants"
import onError from "./error"
import { handlers } from "./handler/index"
import { MessageHandler } from "./handler/messageHandler"

export class Client {
  private ws: WebSocket

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

    const { request, label, name } = message

    return new MessageHandler(request, label, name)
  }

  private onMessage(messageEvent: MessageEvent): void {
    this.getNewHandlerFromEvent(messageEvent).applyHandlers(
      handlers,
      (response) => this.send(response),
      () => this.send({message: "what was that?"}),
    )
  }
}
