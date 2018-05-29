import AuthStep from "../authStep"
import { MESSAGE_LOGIN_FAILED, MESSAGE_LOGIN_PASSWORD, MESSAGE_NAME_OK } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import Name from "./name"

export default class Password extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_LOGIN_PASSWORD
  }

  public async processRequest(request: Request): Promise<Response> {
    const password = request.input

    if (password === this.player.password) {
      return request.ok(new Name(this.player), MESSAGE_NAME_OK)
    }

    return request.fail(this, MESSAGE_LOGIN_FAILED)
  }
}
