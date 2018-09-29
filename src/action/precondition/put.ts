import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import Maybe from "../../functional/maybe"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { MESSAGE_FAIL_CONTAINER_NOT_FOUND, MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  const containerName = request.component
  const itemTable = service.itemTable
  const mobInventory = request.mob.inventory
  const item = itemTable.findItemByInventory(mobInventory, request.subject)
  const container = new Maybe(itemTable.findItemByInventory(mobInventory, containerName))
    .do((i) => i)
    .or(() => itemTable.findItemByInventory(request.getRoom().inventory, containerName))
    .get()

  return new CheckBuilder()
    .require(item, MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY, CheckType.HasItem)
    .require(container, MESSAGE_FAIL_CONTAINER_NOT_FOUND, CheckType.ContainerPresent)
    .create(item)
}
