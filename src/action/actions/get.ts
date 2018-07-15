import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const room = checkedRequest.request.getRoom()
  const mob = checkedRequest.request.mob

  mob.inventory.getItemFrom(item, room.inventory)

  return new ResponseBuilder(checkedRequest.request).success(`You pick up ${item.name}.`)
}
