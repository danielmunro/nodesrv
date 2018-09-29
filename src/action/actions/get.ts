import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"
import { format } from "../../support/string"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)
  const message = container ?
    format(Messages.Get.SuccessFromContainer, item.name, container.name) :
    format(Messages.Get.SuccessFromRoom, item.name)

  checkedRequest.request.mob.inventory.addItem(item)

  return checkedRequest.respondWith().success(message)
}
