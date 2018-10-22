import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { newAttributes, newHitroll, newStats, newVitals } from "../../attributes/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)

  target.addAffect(newAffect(
    AffectType.Curse,
    checkedRequest.mob.level / 10,
    newAttributes(
      newVitals(0, 0, 0),
      newStats(-1, -1, -1, -1, -1, -1),
      newHitroll(1, -4))))

  return checkedRequest.respondWith().success()
}
