import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { format } from "../../support/string"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const room = checkedRequest.request.getRoom()

  room.inventory.addItem(item)

  return checkedRequest.respondWith().success(format(Messages.Drop.Success, item.name))
}
