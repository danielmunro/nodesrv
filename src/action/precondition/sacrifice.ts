import Check from "../../check/check"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_CONTAINER_NOT_EMPTY, Messages } from "./constants"

export default async function(request: Request): Promise<Check> {
  const item = request.findItemInRoomInventory()
  return request.checkWithStandingDisposition()
    .require(item, Messages.All.Item.NotFound)
    .require(item.isContainer() ? item.containerInventory.items.length === 0 : true, MESSAGE_FAIL_CONTAINER_NOT_EMPTY)
    .create(item)
}
