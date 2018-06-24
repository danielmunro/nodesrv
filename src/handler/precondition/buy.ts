import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_ERROR_NO_MERCHANT = "You don't see a merchant anywhere."
export const MESSAGE_ERROR_NO_ITEM = "They don't have that."
export const MESSAGE_ERROR_CANNOT_AFFORD = "You can't afford it."

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
