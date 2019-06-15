import verify from "../../../../player/password/verify"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import PlayerAuthStep from "../playerAuthStep"
import Name from "./name"

export default class Password extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Player.PasswordPrompt
  }

  public async processRequest(request: Request): Promise<Response> {
    if (verify(request.input, this.player.password)) {
      return request.ok(new Name(this.creationService, this.player), CreationMessages.All.Ok)
    }

    return request.fail(this, CreationMessages.Player.LoginFailed)
  }
}
