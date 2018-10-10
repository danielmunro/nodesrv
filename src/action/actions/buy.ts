import CheckedRequest from "../../check/checkedRequest"
import { copy } from "../../item/factory"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import { format } from "../../support/string"
import { ActionOutcome } from "../actionOutcome"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const item = copy(checkedRequest.check.result)

  request.mob.inventory.addItem(item)
  request.mob.gold -= item.value

  return request
    .respondWith(ActionOutcome.ItemCreated, item)
    .success(new ResponseMessage(format(Messages.Buy.Success, item.name, item.value)))
}
