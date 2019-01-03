import { Player } from "../../../player/model/player"
import AuthService from "../authService"
import AuthStep from "../authStep"
import { MESSAGE_FAIL_PASSWORDS_DO_NOT_MATCH, MESSAGE_NEW_PASSWORD_CONFIRM } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import Complete from "./complete"
import Password from "./password"

export default class PasswordConfirm extends PlayerAuthStep implements AuthStep {
  constructor(authService: AuthService, player: Player, public readonly firstPassword: string) {
    super(authService, player)
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD_CONFIRM
  }

  public async processRequest(request: Request): Promise<Response> {
    const confirmPassword = request.input

    if (confirmPassword !== this.firstPassword) {
      return request.fail(new Password(this.authService, this.player), MESSAGE_FAIL_PASSWORDS_DO_NOT_MATCH)
    }

    this.player.setPassword(confirmPassword)

    return request.ok(new Complete(this.authService, this.player))
  }
}
