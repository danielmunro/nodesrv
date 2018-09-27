import Response from "../../request/response"
import { format } from "../../support/string"
import CheckedRequest from "../check/checkedRequest"
import { CheckType } from "../check/checkType"
import { Messages } from "./constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.check.result
  const mob = checkedRequest.request.mob
  mob.inventory.addItem(item)
  const container = checkedRequest.getCheckTypeResult(CheckType.ContainerPresent)
  const message = container ?
    format(Messages.Get.SuccessFromContainer, item.name, container.name) :
    format(Messages.Get.SuccessFromRoom, item.name)

  return checkedRequest.respondWith().success(message)
}
