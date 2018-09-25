import Response from "../../request/response"
import ResponseBuilder from "../../request/responseBuilder"
import { format } from "../../support/string"
import CheckedRequest from "../check/checkedRequest"
import { CheckType } from "../check/checkType"
import { MESSAGE_REMOVE_SUCCESS } from "../precondition/constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  request.player.getInventory().addItem(item)

  return new ResponseBuilder(request).info(format(MESSAGE_REMOVE_SUCCESS, item.name))
}
