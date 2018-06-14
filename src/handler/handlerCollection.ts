import { RequestType } from "../request/requestType"
import { HandlerDefinition } from "./handlerDefinition"

export class HandlerCollection {
  private readonly handlers: HandlerDefinition[]

  constructor(handlers) {
    this.handlers = handlers
  }

  public getMatchingHandlerDefinitionForRequestType(
    requestType: RequestType,
    defaultHandler: HandlerDefinition,
  ): HandlerDefinition {
    const handler = this.handlers.find((it) => it.isAbleToHandleRequestType(requestType))

    if (handler) {
      return handler
    }

    return defaultHandler
  }
}
