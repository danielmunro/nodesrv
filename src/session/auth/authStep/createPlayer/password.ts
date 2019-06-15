import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import PlayerAuthStep from "../playerAuthStep"
import { PASSWORD_MIN_LENGTH } from "./constants"
import PasswordConfirm from "./passwordConfirm"

export default class Password extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Player.PasswordPrompt
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.input.length < PASSWORD_MIN_LENGTH) {
      return request.fail(this, CreationMessages.Player.PasswordTooShort)
    }

    return request.ok(new PasswordConfirm(this.creationService, this.player, request.input))
  }
}
