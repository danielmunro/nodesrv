import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"
import { format } from "../../support/string"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)

  container.containerInventory.addItem(item)

  return checkedRequest.respondWith().success(format(Messages.Put.Success, item.name, container.name))
}
