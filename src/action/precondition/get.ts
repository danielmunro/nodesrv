import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import Maybe from "../../functional/maybe"
import ItemTable from "../../item/itemTable"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE, Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  return new Maybe(request.getContextAsInput().component)
    .do(() => getFromInventory(request, service.itemTable))
    .or(() => getFromRoom(request, service.itemTable))
    .get()
}

function getFromInventory(request: Request, itemTable: ItemTable) {
  const container = itemTable.findItemByInventory(request.mob.inventory, request.getContextAsInput().component)

  return new CheckBuilder()
    .require(container, Messages.All.Item.NotFound, CheckType.ContainerPresent)
    .require(() => itemTable.findItemByInventory(container.containerInventory, request.getSubject()),
      Messages.All.Item.NotFound, CheckType.ItemPresent)
    .create()
}

function getFromRoom(request: Request, itemTable: ItemTable) {
  const item = itemTable.findItemByInventory(request.getRoom().inventory, request.getSubject())
  return new CheckBuilder()
    .require(item, Messages.All.Item.NotFound, CheckType.ItemPresent)
    .require(() => item.isTransferable, MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
    .create(item)
}
