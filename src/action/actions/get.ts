import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import { format } from "../../support/string"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.ItemPresent)
  const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)
  const message = container ?
    format(Messages.Get.SuccessFromContainer, item.name, container.name) :
    format(Messages.Get.SuccessFromRoom, item.name)

  checkedRequest.mob.inventory.addItem(item)

  return checkedRequest.respondWith().success(new ResponseMessage(message))
}
