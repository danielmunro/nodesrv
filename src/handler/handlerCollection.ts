import { RequestType } from "../request/requestType"
import { Definition } from "./definition/definition"

export class HandlerCollection {
  private readonly handlers: Definition[]

  constructor(handlers) {
    this.handlers = handlers
  }

  public getMatchingHandlerDefinitionForRequestType(
    requestType: RequestType,
    defaultHandler: Definition,
  ): Definition {
    const handler = this.handlers.find((it) => it.isAbleToHandleRequestType(requestType))

    if (handler) {
      return handler
    }

    return defaultHandler
  }
}
