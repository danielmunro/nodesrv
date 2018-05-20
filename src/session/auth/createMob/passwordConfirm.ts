import { Mob } from "../../../mob/model/mob"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_PASSWORD_CONFIRM } from "../constants"
import Password from "./password"
import Race from "./race"

export default class PasswordConfirm implements AuthStep {
  public readonly mob: Mob
  public readonly firstPassword: string

  constructor(mob: Mob, firstPassword: string) {
    this.mob = mob
    this.firstPassword = firstPassword
  }

  public getStepMessage(): string {
    return MESSAGE_NEW_PASSWORD_CONFIRM
  }

  public async processRequest(request: Request): Promise<any> {
    const confirmPassword = request.command

    if (confirmPassword !== this.firstPassword) {
      return new Password(this.mob)
    }

    this.mob.password = confirmPassword
    return new Race(this.mob)
  }
}
