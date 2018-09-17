import appetite from "../../mob/race/appetite"
import { Request } from "../../request/request"
import Check from "../check"
import {
  MESSAGE_FAIL_ALREADY_FULL,
  MESSAGE_FAIL_CANNOT_EAT_ITEM,
  MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY,
} from "./constants"

export default function(request: Request): Promise<Check> {
  const item = request.findItemInSessionMobInventory()

  if (!item) {
    return Check.fail(MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY)
  }

  if (!item.isFood()) {
    return Check.fail(MESSAGE_FAIL_CANNOT_EAT_ITEM)
  }

  if (request.mob.playerMob.hunger >= appetite(request.mob.race)) {
    return Check.fail(MESSAGE_FAIL_ALREADY_FULL)
  }

  return Check.ok(item)
}
