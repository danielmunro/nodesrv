import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import { getSizeModifier } from "../../mob/race/sizeModifier"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Messages } from "../constants"
import { Skill } from "../model/skill"

const SUCCESS_THRESHOLD = 50

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const mob = checkedRequest.mob
  const responseBuilder = checkedRequest.respondWith()
  const r = calculateSneakRoll(mob, skill)

  if (r < SUCCESS_THRESHOLD) {
    return responseBuilder.fail(Messages.Sneak.Fail)
  }

  mob.addAffect(newAffect(AffectType.Sneak, mob.level))

  return responseBuilder.success(Messages.Sneak.Success)
}

function calculateSneakRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level) - getSizeModifier(mob.race, 10, -10)
}
