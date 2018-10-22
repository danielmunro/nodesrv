import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) || checkedRequest.mob
  target.addAffect(newAffect(AffectType.Shield, checkedRequest.mob.level))

  return checkedRequest.respondWith().success()
}
