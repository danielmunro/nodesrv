import { assignSpecializationToMob } from "../../../../mob/service/mobService"
import { allSpecializations } from "../../../../mob/specialization/constants"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import { createSpecializationFromType } from "../../../../mob/specialization/factory"
import SpecializationService from "../../../../mob/specialization/service/specializationService"
import {format} from "../../../../support/string"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import PlayerAuthStep from "../playerAuthStep"
import CustomizeCheck from "./customizeCheck"

export default class Specialization extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return format(
      CreationMessages.Mob.SpecializationPrompt,
      SpecializationService.getSpecializationTypes().reduce(
        (previous: string, current: SpecializationType) => {
          return previous + " " + current.toString()
        }, ""))
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
