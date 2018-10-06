import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Skill } from "../model/skill"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const target = checkedRequest.getCheckTypeResult(CheckType.IsFighting)
  const responseBuilder = checkedRequest.respondWith()

  if (calculateDodgeRoll(mob, skill) <= calculateHitRoll(target)) {
    return responseBuilder.fail()
  }

  return responseBuilder.success()
}

function calculateHitRoll(mob: Mob): number {
  const attrs = mob.getCombinedAttributes()
  return roll(1, attrs.stats.dex) + roll(1, attrs.hitroll.hit)
}

function calculateDodgeRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.getCombinedAttributes().stats.dex) + roll(1, skill.level)
}
