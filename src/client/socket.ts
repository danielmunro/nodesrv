export default class Socket {
  constructor(private readonly ws: WebSocket) {}

  public send(data: string) {
    this.ws.send(data)
  }
}
