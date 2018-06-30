import Response from "../../request/response"
import CheckedRequest from "../checkedRequest"
import ResponseBuilder from "../../request/responseBuilder"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const request = checkedRequest.request
  const mob = request.player.sessionMob
  const room = request.getRoom()

  mob.inventory.removeItem(item)
  room.inventory.addItem(item)

  return new ResponseBuilder(request).success(`You drop ${item.name}.`)
}
