import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { newAttributesWithHitrollStats, newHitroll, newStats } from "../../attributes/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
  const spell = checkedRequest.getCheckTypeResult(CheckType.HasSpell)

  target.addAffect(
    newAffect(
      AffectType.Poison,
      spell.level,
      newAttributesWithHitrollStats(newHitroll(0, -1), newStats(-1, 0, 0, 0, -1, -1))))

  return checkedRequest.respondWith().success()
}
