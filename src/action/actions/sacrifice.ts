import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import { format } from "../../support/string"
import { ActionOutcome } from "../actionOutcome"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const room = checkedRequest.request.getRoom()
  room.inventory.removeItem(item)
  const value = Math.max(1, item.value / 10)
  checkedRequest.request.mob.gold += value

  return checkedRequest
    .respondWith(ActionOutcome.ItemDestroyed, item)
    .success(new ResponseMessage(format(Messages.Sacrifice.Success, item.name, value)))
}
