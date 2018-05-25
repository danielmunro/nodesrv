import { validate } from "email-validator"
import { findOneByEmail } from "../../../player/repository/player"
import AuthStep from "../authStep"
import { MESSAGE_EMAIL, MESSAGE_FAIL_EMAIL_ADDRESS_INVALID } from "../constants"
import Request from "../request"
import Response from "../response"
import NewPlayerConfirm from "./newPlayerConfirm"
import Password from "./password"

export default class Email implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_EMAIL
  }

  public async processRequest(request: Request): Promise<Response> {
    const email = request.input
    const player = await findOneByEmail(email)

    if (!this.isEmailValid(email)) {
      return request.fail(this, MESSAGE_FAIL_EMAIL_ADDRESS_INVALID)
    }

    if (player) {
      return request.ok(new Password(player))
    }

    return request.ok(new NewPlayerConfirm(email))
  }

  private isEmailValid(email: string): boolean {
    return validate(email)
  }
}
