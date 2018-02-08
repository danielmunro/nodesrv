import { RequestType } from "./constants"
import { Player } from "../../player/player"
import { HandlerDefinition } from "./handlerDefinition";

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
    this.getHandlerDefinition(
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

  private getHandlerDefinition(defs: HandlerDefinition[], defaultHandlerDefinition: HandlerDefinition): HandlerDefinition {
    const handler = defs.find((it) => it.isMatch(this.request))
    if (handler) {
      return handler
    }

    return defaultHandlerDefinition
  }
}
