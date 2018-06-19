import { RequestType } from "../../request/requestType"
import { Definition } from "./definition"

export class Collection {
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
