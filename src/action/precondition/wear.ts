import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_FAIL_NO_ITEM_FOUND = "You don't have that."

export default function(request: Request): Promise<Check> {
  const mob = request.player.sessionMob
  const item = mob.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_FAIL_NO_ITEM_FOUND)
  }

  return Check.ok(item)
}
