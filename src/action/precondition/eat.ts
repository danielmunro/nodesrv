import Check from "../../check/check"
import appetite from "../../mob/race/appetite"
import { Request } from "../../request/request"
import {
  MESSAGE_FAIL_ALREADY_FULL,
  MESSAGE_FAIL_CANNOT_EAT_ITEM,
  Messages,
} from "./constants"

export default function(request: Request): Promise<Check> {
  const item = request.findItemInSessionMobInventory()

  if (!item) {
    return Check.fail(Messages.All.Item.NotOwned)
  }

  if (!item.isFood()) {
    return Check.fail(MESSAGE_FAIL_CANNOT_EAT_ITEM)
  }

  if (request.mob.playerMob.hunger >= appetite(request.mob.race)) {
    return Check.fail(MESSAGE_FAIL_ALREADY_FULL)
  }

  return Check.ok(item)
}
