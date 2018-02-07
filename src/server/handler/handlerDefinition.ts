import { Handler } from "./constants";

export class HandlerDefinition {
  private handler: Handler
  private callback: (handler: Handler, cb: (result) => void) => void

  constructor(handler, callback) {
    this.handler = handler
    this.callback = callback
  }

  public isHandlerMatch(handler: Handler): boolean {
    return this.handler === handler
  }

  public applyCallback(cb: (response) => void) {
    this.callback(this.handler, cb)
  }
}