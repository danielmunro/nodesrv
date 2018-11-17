import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { MESSAGE_ERROR_NO_ITEM, Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  const merchant = service.getMobsByRoom(request.room).find(mob => mob.isMerchant())
  let item

  const checkBuilder = new CheckBuilder()
    .requireMob(merchant, Messages.All.Item.NoMerchant)

  if (merchant) {
    item = merchant.inventory.findItemByName(request.getContextAsInput().subject)
    checkBuilder.require(item, MESSAGE_ERROR_NO_ITEM)
    checkBuilder.capture()

    if (item) {
      checkBuilder.require(request.mob.gold > item.value, Messages.Buy.CannotAfford)
    }
  }

  return checkBuilder.create()
}
