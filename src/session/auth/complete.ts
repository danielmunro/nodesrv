import { newAttributes, newHitroll, newStartingStats, newStartingVitals } from "../../attributes/factory"
import { Mob } from "../../mob/model/mob"
import { findPlayerMobByName } from "../../mob/repository/mob"
import { Request } from "../../server/request/request"
import AuthStep from "./authStep"
import { MESSAGE_COMPLETE } from "./constants"
import NewMobConfirm from "./creation/newMobConfirm"
import Password from "./login/password"

export default class Complete implements AuthStep {
  public readonly mob: Mob

  constructor(mob: Mob) {
    this.mob = mob
  }

  public getStepMessage(): string {
    return MESSAGE_COMPLETE
  }

  public async processRequest(request: Request): Promise<any> {
    this.mob.vitals = newStartingVitals()
    this.mob.attributes.push(newAttributes(
      newStartingVitals(),
      newStartingStats(),
      newHitroll(1, 1),
    ))
    return this
  }
}
