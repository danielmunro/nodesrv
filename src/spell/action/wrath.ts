import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { newAttributes, newHitroll, newStats, newVitals } from "../../attributes/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) || checkedRequest.mob
  target.addAffect(newAffect(
    AffectType.Wrath,
    checkedRequest.mob.level,
    newAttributes(
      newVitals(20 * (checkedRequest.mob.level / 10), 0, 0),
      newStats(1, -2, -2, 1, 1, 0),
      newHitroll(1, 2))))

  return checkedRequest.respondWith().success()
}
