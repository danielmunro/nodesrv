import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import Maybe from "../../support/functional/maybe"
import GameService from "../../gameService/gameService"
import ItemTable from "../../item/itemTable"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE, Messages } from "./constants"
import Service from "../../session/auth/service"

export default function(request: Request, service: GameService): Promise<Check> {
  return new Maybe(request.getContextAsInput().component)
    .do(() => getFromInventory(request, service))
    .or(() => getFromRoom(request, service))
    .get()
}

function getFromInventory(request: Request, service: GameService) {
  const container = service.itemService.findItem(request.mob.inventory, request.getContextAsInput().component)

  return new CheckBuilder(service.mobService)
    .require(container, Messages.All.Item.NotFound, CheckType.ContainerPresent)
    .require(() => service.itemService.findItem(container.container, request.getSubject()),
      Messages.All.Item.NotFound, CheckType.ItemPresent)
    .capture()
    .create()
}

function getFromRoom(request: Request, service: GameService) {
  const item = service.itemService.findItem(request.getRoom().inventory, request.getSubject())
  return new CheckBuilder(service.mobService)
    .require(item, Messages.All.Item.NotFound, CheckType.ItemPresent)
    .capture()
    .require(() => item.isTransferable, MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
    .create()
}
