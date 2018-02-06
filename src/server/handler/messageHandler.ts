import { Handler } from "./constants"
import { Player } from "../../player/player"

export class MessageHandler {
  private player: Player
  private request: Handler
  private args

  constructor(player: Player, request: Handler, args) {
    this.player = player
    this.request = request
    this.args = args
  }

  public applyHandlers(handlers, success, failure) {
    const handler = handlers.find((it) => it.handler === this.request)
    if (handler) {
      handler.callback(this, success)
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
