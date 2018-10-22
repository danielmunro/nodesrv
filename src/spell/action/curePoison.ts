import { AffectType } from "../../affect/affectType"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) || checkedRequest.mob

  target.affects = target.affects.filter((a) => a.affectType !== AffectType.Poison)

  return checkedRequest.respondWith().success()
}
