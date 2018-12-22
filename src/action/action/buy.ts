import { cloneDeep } from "lodash"
import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { ActionOutcome } from "../actionOutcome"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const item = cloneDeep(checkedRequest.check.result)

  request.mob.inventory.addItem(item)
  request.mob.gold -= item.value

  const replacements = {
    item,
    value: item.value,
  }

  return request
    .respondWith(ActionOutcome.ItemCreated, item)
    .success(Messages.Buy.Success,
      { verb: "buy", ...replacements },
      { verb: "buys", ...replacements })
}
