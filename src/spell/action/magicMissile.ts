import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import roll from "../../random/dice"

export default function(checkedRequest: CheckedRequest) {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
  target.vitals.hp -= roll(1, 4)

  return checkedRequest
    .respondWith()
    .success()
}
