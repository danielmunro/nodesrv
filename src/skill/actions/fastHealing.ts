import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Skill } from "../model/skill"
import { Thresholds } from "./constants"

function fastHealingRoll(mob: Mob, skill: Skill) {
  return roll(2, mob.level + (skill.level / 2))
}

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const responseBuilder = checkedRequest.respondWith()

  if (fastHealingRoll(mob, skill) <= Thresholds.FastHealing) {
    return responseBuilder.fail()
  }

  mob.vitals.hp += mob.getCombinedAttributes().vitals.hp / 100
  mob.normalizeVitals()

  return responseBuilder.success()
}
