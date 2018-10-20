import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import Maybe from "../../functional/maybe"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { MESSAGE_FAIL_CONTAINER_NOT_FOUND, Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  const containerName = request.getContextAsInput().component
  const itemTable = service.itemTable
  const mobInventory = request.mob.inventory
  const item = itemTable.findItemByInventory(mobInventory, request.getContextAsInput().subject)
  const container = new Maybe(itemTable.findItemByInventory(mobInventory, containerName))
    .do((i) => i)
    .or(() => itemTable.findItemByInventory(request.getRoom().inventory, containerName))
    .get()

  return new CheckBuilder()
    .require(item, Messages.All.Item.NotOwned, CheckType.HasItem)
    .capture()
    .require(container, MESSAGE_FAIL_CONTAINER_NOT_FOUND, CheckType.ContainerPresent)
    .create()
}
