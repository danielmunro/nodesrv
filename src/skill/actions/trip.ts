import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import { getSizeModifier } from "../../mob/race/sizeModifier"
import roll from "../../random/dice"
import Response from "../../request/response"
import { format } from "../../support/string"
import { Costs } from "../constants"
import { Skill } from "../model/skill"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const target = checkedRequest.getCheckTypeResult(CheckType.IsFighting)
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const responseBuilder = checkedRequest.respondWith()

  if (calculateTripRoll(mob, skill) < calculateDefenseRoll(target)) {
    return responseBuilder.fail(format(`You failed to trip {0}.`, Costs.Trip.Delay))
  }

  const amount = skill.level / 10
  target.addAffect(newAffect(AffectType.Stunned, amount))
  target.vitals.hp -= amount

  return responseBuilder.success(format(`You tripped {0}!`, Costs.Trip.Delay))
}

function calculateDefenseRoll(mob: Mob): number {
  return roll(1, mob.getCombinedAttributes().stats.dex)
}

function calculateTripRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.getCombinedAttributes().stats.dex) + roll(1, skill.level) +
    getSizeModifier(mob.race, -10, 10)
}
