import roll from "../../random/dice"
import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { CheckType } from "../../check/checkType"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
  target.vitals.hp -= roll(2, 6)

  return checkedRequest.respondWith().success()
}
