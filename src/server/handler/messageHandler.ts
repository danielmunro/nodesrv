export class MessageHandler {
  private request
  private label
  private name

  constructor(request, label, name) {
    this.request = request
    this.label = label
    this.name = name
  }

  public applyHandlers(handlers, success, failure) {
    if (handlers[this.request]) {
      handlers[this.request](this.label, this.name, success)
      return
    }

    failure()
  }
}
