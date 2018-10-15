import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import { format } from "../../support/string"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const room = checkedRequest.request.getRoom()

  room.inventory.addItem(item)

  return checkedRequest.respondWith().success(
    new ResponseMessage(
      Messages.Drop.Success,
      ["you", "drop", item.name],
      [checkedRequest.mob.name, "drops", item.name]))
}
