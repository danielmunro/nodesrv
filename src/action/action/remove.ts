import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import Response from "../../request/response"
import { format } from "../../support/string"
import { Messages } from "../precondition/constants"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  checkedRequest.request.mob.inventory.addItem(item)

  return checkedRequest.respondWith().info(format(Messages.Remove.Success, item.name))
}
