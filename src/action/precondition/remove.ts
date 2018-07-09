import { Request } from "../../request/request"
import Check from "../check"

export const MESSAGE_REMOVE_FAIL = "You aren't wearing that."

export default function(request: Request): Promise<Check> {
  const mob = request.player.sessionMob
  const item = mob.equipped.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_REMOVE_FAIL)
  }

  return Check.ok()
}
