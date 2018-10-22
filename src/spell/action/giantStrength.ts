import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { newAttributesWithStats, newStats } from "../../attributes/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) || checkedRequest.mob
  const spell = checkedRequest.getCheckTypeResult(CheckType.HasSpell)
  const bonus = Math.ceil(spell.level / 2)
  target.addAffect(
    newAffect(
      AffectType.GiantStrength,
      spell.level,
      newAttributesWithStats(newStats(bonus, 0, 0, 0, 0, 0))))

  return checkedRequest.respondWith().success()
}
