import AuthStep from "../authStep"
import { MESSAGE_FAIL_PASSWORD_TOO_SHORT, MESSAGE_NEW_PASSWORD } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import { PASSWORD_MIN_LENGTH } from "./constants"
import PasswordConfirm from "./passwordConfirm"

export default class Password extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.input.length < PASSWORD_MIN_LENGTH) {
      return request.fail(this, MESSAGE_FAIL_PASSWORD_TOO_SHORT)
    }

    return request.ok(new PasswordConfirm(this.authService, this.player, request.input))
  }
}
