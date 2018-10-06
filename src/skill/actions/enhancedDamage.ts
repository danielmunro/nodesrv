import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { SuccessThreshold } from "../constants"
import { Skill } from "../model/skill"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const responseBuilder = checkedRequest.respondWith()

  if (calculateEnhancedDamageRoll(mob, skill) <= SuccessThreshold.EnhancedDamage) {
    return responseBuilder.fail()
  }

  return responseBuilder.success()
}

function calculateEnhancedDamageRoll(mob: Mob, skill: Skill): number {
  const stats = mob.getCombinedAttributes().stats
  return roll(3, Math.max(1, stats.str / 6))
    + roll(3, Math.max(1, stats.sta / 10) + 1)
    + roll(4, Math.max(1, skill.level / 20) + 1)
    + 40
}
