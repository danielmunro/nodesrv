import { Handler } from "./constants"

export class MessageHandler {
  private request: Handler
  private label
  private name

  constructor(request, label, name) {
    this.request = request
    this.label = label
    this.name = name
  }

  public applyHandlers(handlers, success, failure) {
    const handler = handlers.find((it) => it.handler === this.request)
    if (handler) {
      handler.callback(this.label, this.name, success)
      return
    }

    failure()
  }
}
