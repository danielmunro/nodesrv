import { validate } from "email-validator"
import AuthStep from "../authStep"
import { MESSAGE_EMAIL, MESSAGE_FAIL_EMAIL_ADDRESS_INVALID } from "../constants"
import Request from "../request"
import Response from "../response"
import AuthService from "../authService"
import NewPlayerConfirm from "./newPlayerConfirm"
import Password from "./password"

export default class Email implements AuthStep {
  private static isEmailValid(email: string): boolean {
    return validate(email)
  }

  constructor(private readonly authService: AuthService) {}

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
      return request.ok(new Password(player))
    }

    return request.ok(new NewPlayerConfirm(this.authService, email))
  }
}
