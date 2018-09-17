import { Request } from "../../request/request"
import Check from "../check"
import { MESSAGE_ERROR_CANNOT_AFFORD, MESSAGE_ERROR_NO_ITEM, MESSAGE_ERROR_NO_MERCHANT } from "./constants"

export default function(request: Request): Promise<Check> {
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())

  if (!merchant) {
    return Check.fail(MESSAGE_ERROR_NO_MERCHANT)
  }

  const item = merchant.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_ERROR_NO_ITEM)
  }

  const mob = request.player.sessionMob

  if (mob.gold < item.value) {
    return Check.fail(MESSAGE_ERROR_CANNOT_AFFORD)
  }

  return Check.ok()
}
