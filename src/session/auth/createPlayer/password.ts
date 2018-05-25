import AuthStep from "../authStep"
import { MESSAGE_NEW_PASSWORD } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import PasswordConfirm from "./passwordConfirm"

export default class Password extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD
  }

  public async processRequest(request: Request): Promise<Response> {
    return request.ok(new PasswordConfirm(this.player, request.input))
  }
}
