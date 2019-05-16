import { assignSpecializationToMob } from "../../../mob/mobService"
import { allSpecializations } from "../../../mob/specialization/constants"
import { createSpecializationFromType } from "../../../mob/specialization/factory"
import AuthStep from "../authStep"
import {CreationMessages} from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"
import CustomizeCheck from "./customizeCheck"

export default class Specialization extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Mob.SpecializationPrompt
  }

  public async processRequest(request: Request): Promise<Response> {
    const specialization = allSpecializations.find((s) => s.startsWith(request.input))

    if (!specialization) {
      return request.fail(this, CreationMessages.Mob.SpecializationInvalid)
    }

    assignSpecializationToMob(this.player.sessionMob, createSpecializationFromType(specialization))

    return request.ok(new CustomizeCheck(this.creationService, this.player))
  }
}
