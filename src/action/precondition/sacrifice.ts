import { Request } from "../../request/request"
import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { MESSAGE_FAIL_CONTAINER_NOT_EMPTY, MESSAGE_FAIL_ITEM_NOT_IN_ROOM } from "./constants"

export default async function(request: Request): Promise<Check> {
  const item = request.findItemInRoomInventory()
  return await new CheckBuilder()
    .require(item, MESSAGE_FAIL_ITEM_NOT_IN_ROOM)
    .require(item.isContainer() ? item.containerInventory.items.length === 0 : true, MESSAGE_FAIL_CONTAINER_NOT_EMPTY)
    .create(item)
}
