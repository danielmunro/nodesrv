import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)

  container.container.addItem(item)

  return checkedRequest.respondWith().success(Messages.Put.Success, { item, container })
}
