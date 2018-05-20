import { Player } from "../../../player/model/player"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_PASSWORD } from "../constants"
import PasswordConfirm from "./passwordConfirm"

export default class Password implements AuthStep {
  public readonly player: Player

  constructor(player: Player) {
    this.player = player
  }

  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD
  }

  public async processRequest(request: Request): Promise<any> {
    const password = request.command

    return new PasswordConfirm(this.player, password)
  }
}
