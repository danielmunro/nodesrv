import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_FAIL_NO_ITEM = "You don't see that anywhere."

export default function(request: Request): Promise<Check> {
  const mob = request.player.sessionMob
  const item = mob.room.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_FAIL_NO_ITEM)
  }

  return Check.ok(item)
}
