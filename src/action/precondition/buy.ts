import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import {MESSAGE_ERROR_NO_ITEM, Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const subject = request.getContextAsInput().subject
  const merchant = service.getMobsByRoom(request.room).find(mob => mob.isMerchant())

  return new CheckBuilder(service.mobService)
    .require(subject, Messages.All.Arguments.Buy)
    .requireMob(merchant, Messages.All.Item.NoMerchant)
    .require(mob => mob.inventory.findItemByName(subject), MESSAGE_ERROR_NO_ITEM, CheckType.HasItem)
    .capture()
    .require(item => request.mob.gold > item.value, Messages.Buy.CannotAfford)
    .create()
}
