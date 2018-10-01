import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Item } from "../../item/model/item"
import { Mob } from "../../mob/model/mob"
import Response from "../../request/response"
import { format } from "../../support/string"
import { ActionOutcome } from "../actionOutcome"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const mob = checkedRequest.request.mob

  return checkedRequest
    .respondWith(ActionOutcome.ItemDestroyed, item)
    .success(sell(mob, item))
}

function sell(mob: Mob, item: Item) {
  mob.inventory.removeItem(item)
  mob.gold += item.value

  return format(Messages.Sell.Success, item.name, item.value)
}
