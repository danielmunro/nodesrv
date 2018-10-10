import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import { getSizeModifier } from "../../mob/race/sizeModifier"
import roll from "../../random/dice"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import { Messages } from "../constants"
import { Skill } from "../model/skill"
import { Thresholds } from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const mob = checkedRequest.mob
  const responseBuilder = checkedRequest.respondWith()

  if (calculateSneakRoll(mob, skill) < Thresholds.Sneak) {
    return responseBuilder.fail(new ResponseMessage(Messages.Sneak.Fail))
  }

  mob.addAffect(newAffect(AffectType.Sneak, mob.level))

  return responseBuilder.success(new ResponseMessage(Messages.Sneak.Success))
}

function calculateSneakRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level) - getSizeModifier(mob.race, 10, -10)
}
