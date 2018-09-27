import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import CheckedRequest from "../check/checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const request = checkedRequest.request
  const room = request.getRoom()
  room.inventory.addItem(item)

  return request.respondWith().success(`You drop ${item.name}.`)
}
