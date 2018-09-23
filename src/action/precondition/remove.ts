import { Request } from "../../request/request"
import Check from "../check/check"
import { MESSAGE_REMOVE_FAIL } from "./constants"

export default function(request: Request): Promise<Check> {
  const mob = request.player.sessionMob
  const item = mob.equipped.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_REMOVE_FAIL)
  }

  return Check.ok()
}
