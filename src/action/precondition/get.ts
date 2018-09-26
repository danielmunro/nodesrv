import { Request } from "../../request/request"
import Service from "../../room/service"
import Check from "../check/check"
import CheckBuilder from "../check/checkBuilder"
import { CheckType } from "../check/checkType"
import { MESSAGE_FAIL_ITEM_NOT_IN_ROOM, MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  const checkBuilder = new CheckBuilder()

  if (request.component) {
    const containerItem = service.itemTable.findItemByInventory(request.mob.inventory, request.component)
    return checkBuilder.require(containerItem, MESSAGE_FAIL_ITEM_NOT_IN_ROOM, CheckType.ContainerPresent)
      .require(containerItem, MESSAGE_FAIL_ITEM_NOT_IN_ROOM, CheckType.ItemPresent)
      .create(containerItem)
  }

  const item = request.mob.room.inventory.findItemByName(request.subject)
  checkBuilder.require(item, MESSAGE_FAIL_ITEM_NOT_IN_ROOM, CheckType.ItemPresent)
  if (item) {
    checkBuilder.require(item.isTransferable, MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  }

  return checkBuilder.create(item)
}
