import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { MESSAGE_ERROR_NO_ITEM, Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const subject = request.getContextAsInput().subject
  const merchant = service.getMobsByRoom(request.room).find(mob => mob.isMerchant())
  let item

  const checkBuilder = new CheckBuilder(service.mobService)
    .require(subject, Messages.All.Arguments.Buy)
    .requireMob(merchant, Messages.All.Item.NoMerchant)

  if (merchant) {
    item = merchant.inventory.findItemByName(subject)
    checkBuilder.require(item, MESSAGE_ERROR_NO_ITEM)
    checkBuilder.capture()

    if (item) {
      checkBuilder.require(request.mob.gold > item.value, Messages.Buy.CannotAfford)
    }
  }

  return checkBuilder.create()
}
