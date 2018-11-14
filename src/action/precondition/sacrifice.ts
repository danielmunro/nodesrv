import Check from "../../check/check"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_CONTAINER_NOT_EMPTY, Messages } from "./constants"

export default async function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .require(request.findItemInRoomInventory(), Messages.All.Item.NotFound)
    .capture()
    .require(item => item.isContainer()
      ? item.container.items.length === 0 : true, MESSAGE_FAIL_CONTAINER_NOT_EMPTY)
    .create()
}
