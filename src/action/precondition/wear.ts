import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .require(
      request.mob.inventory.findItemByName(request.getContextAsInput().subject),
      Messages.All.Item.NotOwned,
      CheckType.HasItem)
    .capture()
    .require(item => !!item.equipment, Messages.All.Item.NotEquipment)
    .create()
}
