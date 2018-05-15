import { Mob } from "../../../mob/model/mob"
import { allRaces } from "../../../mob/race/race"
import { assignSpecializationToMob } from "../../../mob/service"
import { createSpecializationFromType } from "../../../mob/specialization/factory"
import { allSpecializations } from "../../../mob/specialization/specializationType"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import Complete from "../complete"
import { MESSAGE_CHOOSE_SPECIALIZATION } from "../constants"

export default class Specialization implements AuthStep {
  public readonly mob: Mob

  constructor(mob: Mob) {
    this.mob = mob
  }

  public getStepMessage(): string {
    return MESSAGE_CHOOSE_SPECIALIZATION
  }

  public async processRequest(request: Request): Promise<any> {
    const input = request.command
    const specialization = allSpecializations.find((s) => s.startsWith(input))

    if (!specialization) {
      return this
    }

    assignSpecializationToMob(this.mob, createSpecializationFromType(specialization))

    return new Complete(this.mob)
  }
}
