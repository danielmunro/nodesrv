import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const room = checkedRequest.request.getRoom()

  room.inventory.addItem(item)

  return checkedRequest.respondWith().success(
    Messages.Drop.Success,
    { item, verb: "drop" },
    { item, verb: "drops" })
}
