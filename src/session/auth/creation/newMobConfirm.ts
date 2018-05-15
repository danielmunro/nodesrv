import { Mob } from "../../../mob/model/mob"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_MOB_CONFIRM } from "../constants"
import Name from "../name"
import Password from "./password"

export default class NewMobConfirm implements AuthStep {
  public readonly name: string

  constructor(name: string) {
    this.name = name
  }

  public getStepMessage(): string {
    return MESSAGE_NEW_MOB_CONFIRM
  }

  public async processRequest(request: Request): Promise<any> {
    const response = request.command

    if (response === "n") {
      return new Name()
    }

    if (response === "y") {
      const mob = new Mob()
      mob.name = this.name
      mob.isPlayer = true
      return new Password(mob)
    }

    return this
  }
}
