import {MessageCallback} from "./type/messageCallback"

export default class Socket {
  constructor(private readonly ws: WebSocket) {}

  public send(data: string) {
    this.ws.send(data)
  }

  public onMessage(messageCallback: MessageCallback) {
    this.ws.onmessage = messageCallback
  }
}
