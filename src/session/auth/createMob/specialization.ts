import { assignSpecializationToMob } from "../../../mob/service"
import { createSpecializationFromType } from "../../../mob/specialization/factory"
import { allSpecializations } from "../../../mob/specialization/specializationType"
import AuthStep from "../authStep"
import { MESSAGE_CHOOSE_SPECIALIZATION, MESSAGE_FAIL_SPECIALIZATION_UNAVAILABLE } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import Complete from "./complete"

export default class Specialization extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_CHOOSE_SPECIALIZATION
  }

  public async processRequest(request: Request): Promise<Response> {
    const specialization = allSpecializations.find((s) => s.startsWith(request.input))

    if (!specialization) {
      return request.fail(this, MESSAGE_FAIL_SPECIALIZATION_UNAVAILABLE)
    }

    assignSpecializationToMob(this.player.sessionMob, createSpecializationFromType(specialization))

    return request.ok(new Complete(this.player))
  }
}
