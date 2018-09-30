import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"
import { format } from "../../support/string"
import { ActionOutcome } from "../actionOutcome"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const mob = checkedRequest.request.mob

  mob.inventory.removeItem(item)
  mob.gold += item.value

  return checkedRequest
    .respondWith(ActionOutcome.ItemDestroyed, item)
    .success(format(Messages.Sell.Success, item.name, item.value))
}
