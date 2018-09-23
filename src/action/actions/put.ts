import Response from "../../request/response"
import CheckedRequest from "../checkedRequest"
import { CheckType } from "../checkType"
import ResponseBuilder from "../../request/responseBuilder"
import { format } from "../../support/string"
import { MESSAGE_SUCCESS_PUT } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)

  container.addItem(item)

  return new ResponseBuilder(checkedRequest.request).success(format(MESSAGE_SUCCESS_PUT, item.name, container.name))
}
