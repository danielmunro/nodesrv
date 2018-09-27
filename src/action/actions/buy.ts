import { copy } from "../../item/factory"
import Response from "../../request/response"
import { format } from "../../support/string"
import { Messages } from "./constants"
import CheckedRequest from "../check/checkedRequest"

export default function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const item = copy(checkedRequest.check.result)
  request.mob.inventory.addItem(item)
  request.mob.gold -= item.value

  return request.respondWith().success(format(Messages.Buy.Success, item.name, item.value))
}
