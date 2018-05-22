import { Player } from "../../../player/model/player"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_PASSWORD_CONFIRM } from "../constants"
import Complete from "./complete"
import Password from "./password"

export default class PasswordConfirm implements AuthStep {
  public readonly player: Player
  public readonly firstPassword: string

  constructor(player: Player, firstPassword: string) {
    this.player = player
    this.firstPassword = firstPassword
  }

  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD_CONFIRM
  }

  public async processRequest(request: Request): Promise<any> {
    const confirmPassword = request.command

    if (confirmPassword !== this.firstPassword) {
      return new Password(this.player)
    }

    this.player.password = confirmPassword

    return new Complete(this.player)
  }
}
