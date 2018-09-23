import Response from "../../request/response"
import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { format } from "../../support/string"
import CheckedRequest from "../check/checkedRequest"
import { MESSAGE_SUCCESS_SACRIFICE } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const room = checkedRequest.request.getRoom()
  room.inventory.removeItem(item)
  const value = Math.max(1, item.value / 10)
  checkedRequest.request.mob.gold += value

  return new ResponseBuilder(checkedRequest.request).success(format(MESSAGE_SUCCESS_SACRIFICE, item.name, value))
}
