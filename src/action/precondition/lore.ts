import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const mobInventory = request.mob.inventory
  const item = service.itemService.findItem(mobInventory, request.getContextAsInput().subject)

  return service.createDefaultCheckFor(request)
    .require(item, Messages.All.Item.NotFound, CheckType.HasItem)
    .require(item.identified, Messages.Lore.FailNotIdentified)
    .create()
}
