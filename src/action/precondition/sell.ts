import { Request } from "../../request/request"
import Check from "../check"
import { MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY, MESSAGE_FAIL_NO_MERCHANT } from "./constants"

export default function(request: Request): Promise<Check> {
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())

  if (!merchant) {
    return Check.fail(MESSAGE_FAIL_NO_MERCHANT)
  }

  const mob = request.player.sessionMob
  const item = mob.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY)
  }

  return Check.ok(item)
}
