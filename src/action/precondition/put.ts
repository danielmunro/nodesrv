import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import Maybe from "../../support/functional/maybe"
import { MESSAGE_FAIL_CONTAINER_NOT_FOUND, Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const containerName = request.getContextAsInput().component
  const itemService = service.itemService
  const mobInventory = request.mob.inventory
  const item = itemService.findItem(mobInventory, request.getContextAsInput().subject)
  const container = new Maybe(itemService.findItem(mobInventory, containerName))
    .do((i) => i)
    .or(() => itemService.findItem(request.getRoom().inventory, containerName))
    .get()

  return new CheckBuilder(service.mobService)
    .require(item, Messages.All.Item.NotOwned, CheckType.HasItem)
    .capture()
    .require(container, MESSAGE_FAIL_CONTAINER_NOT_FOUND, CheckType.ContainerPresent)
    .create()
}
