import { Mob } from "../../../mob/model/mob"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_PASSWORD } from "../constants"
import PasswordConfirm from "./passwordConfirm"

export default class Password implements AuthStep {
  public readonly mob: Mob

  constructor(mob: Mob) {
    this.mob = mob
  }

  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD
  }

  public async processRequest(request: Request): Promise<any> {
    const password = request.command

    return new PasswordConfirm(this.mob, password)
  }
}
