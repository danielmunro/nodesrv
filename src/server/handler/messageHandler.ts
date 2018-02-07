import { Handler } from "./constants"
import { Player } from "../../player/player"
import { HandlerDefinition } from "./handlerDefinition";

export class MessageHandler {
  private player: Player
  private request: Handler
  private args

  constructor(player: Player, request: Handler, args = []) {
    this.player = player
    this.request = request
    this.args = args
  }

  public applyHandlers(handlers: HandlerDefinition[], success: (response) => void, failure: () => void) {
    const handler = handlers.find((it) => it.isHandlerMatch(this.request))
    if (handler) {
      handler.applyCallback(success)
      return
    }

    failure()
  }

  public getArgs() {
    return this.args
  }

  public getPlayer(): Player {
    return this.player
  }
}
