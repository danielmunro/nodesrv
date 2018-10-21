import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Skill } from "../model/skill"

function isSecondAttackInvoked(mob: Mob, skill: Skill) {
  return roll(1, skill.level) > mob.level
}

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const responseBuilder = checkedRequest.respondWith()

  if (isSecondAttackInvoked(mob, skill)) {
    return responseBuilder.fail()
  }

  return responseBuilder.success()
}
