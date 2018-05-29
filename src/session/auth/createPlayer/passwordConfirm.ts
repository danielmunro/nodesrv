import { Player } from "../../../player/model/player"
import AuthStep from "../authStep"
import { MESSAGE_FAIL_PASSWORDS_DO_NOT_MATCH, MESSAGE_NEW_PASSWORD_CONFIRM } from "../constants"
import Request from "../request"
import Response from "../response"
import Complete from "./complete"
import Password from "./password"

export default class PasswordConfirm implements AuthStep {
  public readonly player: Player
  public readonly firstPassword: string

  constructor(player: Player, firstPassword: string) {
    this.player = player
    this.firstPassword = firstPassword
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD_CONFIRM
  }

  public async processRequest(request: Request): Promise<Response> {
    const confirmPassword = request.input

    if (confirmPassword !== this.firstPassword) {
      return request.fail(new Password(this.player), MESSAGE_FAIL_PASSWORDS_DO_NOT_MATCH)
    }

    this.player.password = confirmPassword

    return request.ok(new Complete(this.player))
  }
}
