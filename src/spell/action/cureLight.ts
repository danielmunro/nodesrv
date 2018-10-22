import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import roll from "../../random/dice"
import Response from "../../request/response"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) || checkedRequest.mob

  target.vitals.hp += roll(1, 4)

  return checkedRequest.respondWith().success()
}
