import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import Maybe from "../../support/functional/maybe"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_CONTAINER_NOT_FOUND, Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
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
