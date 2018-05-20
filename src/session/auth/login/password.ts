import { Player } from "../../../player/model/player"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_LOGIN_PASSWORD } from "../constants"
import Name from "./name"

export default class Password implements AuthStep {
  public readonly player: Player

  constructor(player: Player) {
    this.player = player
  }

  public getStepMessage(): string {
    return MESSAGE_LOGIN_PASSWORD
  }

  public async processRequest(request: Request): Promise<any> {
    const password = request.command

    if (password === this.player.password) {
      return new Name(this.player)
    }

    return this
  }
}
