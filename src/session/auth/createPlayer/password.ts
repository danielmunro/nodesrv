import AuthStep from "../authStep"
import { MESSAGE_FAIL_PASSWORD_TOO_SHORT, MESSAGE_NEW_PASSWORD } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import PasswordConfirm from "./passwordConfirm"

export default class Password extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.input.length < 3) {
      return request.fail(this, MESSAGE_FAIL_PASSWORD_TOO_SHORT)
    }

    return request.ok(new PasswordConfirm(this.player, request.input))
  }
}
