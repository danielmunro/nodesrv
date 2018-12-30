import { validate } from "email-validator"
import AbstractAuthStep from "../abstractAuthStep"
import AuthStep from "../authStep"
import { MESSAGE_EMAIL, MESSAGE_FAIL_EMAIL_ADDRESS_INVALID } from "../constants"
import Request from "../request"
import Response from "../response"
import NewPlayerConfirm from "./newPlayerConfirm"
import Password from "./password"

export default class Email extends AbstractAuthStep implements AuthStep {
  private static isEmailValid(email: string): boolean {
    return validate(email)
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_EMAIL
  }

  public async processRequest(request: Request): Promise<Response> {
    const email = request.input

    if (!Email.isEmailValid(email)) {
      return request.fail(this, MESSAGE_FAIL_EMAIL_ADDRESS_INVALID)
    }

    const player = await this.authService.getOnePlayer(email)

    if (player) {
      return request.ok(new Password(this.authService, player))
    }

    return request.ok(new NewPlayerConfirm(this.authService, email))
  }
}
