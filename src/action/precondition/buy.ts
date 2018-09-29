import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { Request } from "../../request/request"
import { MESSAGE_ERROR_CANNOT_AFFORD, MESSAGE_ERROR_NO_ITEM, MESSAGE_ERROR_NO_MERCHANT } from "./constants"

export default function(request: Request): Promise<Check> {
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())
  let item

  const checkBuilder = new CheckBuilder()
    .requireMob(merchant, MESSAGE_ERROR_NO_MERCHANT)

  if (merchant) {
    item = merchant.inventory.findItemByName(request.subject)
    checkBuilder.require(item, MESSAGE_ERROR_NO_ITEM)

    if (item) {
      checkBuilder.require(request.mob.gold > item.value, MESSAGE_ERROR_CANNOT_AFFORD)
    }
  }

  return checkBuilder.create(item)
}
