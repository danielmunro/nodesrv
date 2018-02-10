import { RequestType } from "./../handler/constants"
import { HandlerDefinition } from "./../handler/handlerDefinition"
import { Player } from "../../player/player"

export class Request {
  private player: Player
  private request: RequestType
  private args: any[]

  constructor(player: Player, request: RequestType, args = []) {
    this.player = player
    this.request = request
    this.args = args
  }

  public applyHandlerDefinitionsToRequest(handlerDefinitions: HandlerDefinition[], success: (response) => void, failure: () => void) {
    this.getHandlerDefinitionMatchingRequest(
      handlerDefinitions,
      new HandlerDefinition(RequestType.Noop, () => {})
    ).applyCallback(this, success)
  }

  public getArgs() {
    return this.args
  }

  public getPlayer(): Player {
    return this.player
  }

  public getRequestType(): RequestType {
    return this.request
  }

  private getHandlerDefinitionMatchingRequest(defs: HandlerDefinition[], defaultHandlerDefinition: HandlerDefinition): HandlerDefinition {
    const handler = defs.find((it) => it.isAbleToHandleRequestType(this.request))
    if (handler) {
      return handler
    }

    return defaultHandlerDefinition
  }
}
