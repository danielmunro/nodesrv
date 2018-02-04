import { EVENTS } from "./constants"
import onError from "./error"
import { handlers } from "./handler/index"

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

  private onMessage(data): void {
    const message = JSON.parse(data)
    const { request, label, name } = message

    if (handlers[request]) {
      handlers[request](label, name, (response) => this.send(response))
      return
    }

    this.send({message: "what was that?"})
  }
}
