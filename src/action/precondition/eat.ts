import appetite from "../../mob/race/appetite"
import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_FAIL_NO_ITEM = "You don't see that anywhere."
export const MESSAGE_FAIL_CANNOT_EAT_ITEM = "You can't eat that."
export const MESSAGE_FAIL_ALREADY_FULL = "You are too full to eat more."

export default function(request: Request): Promise<Check> {
  const item = request.findItemInSessionMobInventory()

  if (!item) {
    return Check.fail(MESSAGE_FAIL_NO_ITEM)
  }

  if (!item.isFood()) {
    return Check.fail(MESSAGE_FAIL_CANNOT_EAT_ITEM)
  }

  if (request.mob.playerMob.hunger >= appetite(request.mob.race)) {
    return Check.fail(MESSAGE_FAIL_ALREADY_FULL)
  }

  return Check.ok(item)
}
