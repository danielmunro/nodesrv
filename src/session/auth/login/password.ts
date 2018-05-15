import { Mob } from "../../../mob/model/mob"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_LOGIN_PASSWORD } from "../constants"

export default class Password implements AuthStep {
  public readonly mob: Mob

  constructor(mob: Mob) {
    this.mob = mob
  }

  public getStepMessage(): string {
    return MESSAGE_LOGIN_PASSWORD
  }

  public async processRequest(request: Request): Promise<any> {
    const password = request.command

    if (password === this.mob.password) {
      // success?
    }

    return this
  }
}
