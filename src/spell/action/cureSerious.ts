import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget) || checkedRequest.mob

  target.vitals.hp += roll(2, 8)
  const toTarget = { verb: "feel", target: "you" }
  const toOthers = { verb: "feels", target }

  return checkedRequest
    .respondWith()
    .success(
      Messages.CureLight.Success,
      target === checkedRequest.mob ? toTarget : toOthers,
      toTarget,
      toOthers)
}
