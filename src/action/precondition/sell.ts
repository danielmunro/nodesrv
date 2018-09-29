import Check from "../../check/check"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_NO_MERCHANT, Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  const room = request.getRoom()
  const merchant = room.mobs.find((m) => m.isMerchant())

  if (!merchant) {
    return Check.fail(MESSAGE_FAIL_NO_MERCHANT)
  }

  const mob = request.player.sessionMob
  const item = mob.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(Messages.All.Item.NotOwned)
  }

  return Check.ok(item)
}
