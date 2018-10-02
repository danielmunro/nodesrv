import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Costs, Messages } from "../constants"
import { Skill } from "../model/skill"
import { Thresholds } from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const responseBuilder = checkedRequest.respondWith()

  if (calculateBerserkRoll(mob, skill) < Thresholds.Berserk) {
    return responseBuilder.fail(Messages.Berserk.Fail)
  }

  mob.addAffect(newAffect(AffectType.Berserk, mob.level / 10))

  return responseBuilder.success(Messages.Berserk.Success)
}

function calculateBerserkRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level)
}
