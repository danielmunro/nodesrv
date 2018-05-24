import { Request } from "../../../request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_PASSWORD } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import PasswordConfirm from "./passwordConfirm"

export default class Password extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD
  }

  public async processRequest(request: Request): Promise<any> {
    const password = request.command

    return new PasswordConfirm(this.player, password)
  }
}
