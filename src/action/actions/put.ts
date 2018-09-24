import Response from "../../request/response"
import { format } from "../../support/string"
import CheckedRequest from "../check/checkedRequest"
import { CheckType } from "../check/checkType"
import { MESSAGE_SUCCESS_PUT } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)

  container.containerInventory.addItem(item)

  return checkedRequest.respondWith().success(format(MESSAGE_SUCCESS_PUT, item.name, container.name))
}
