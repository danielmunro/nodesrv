import { Request } from "../../request/request"
import Check from "../check"
import { MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY } from "./constants"

export default function(request: Request): Promise<Check> {
  const mob = request.player.sessionMob
  const item = mob.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY)
  }

  return Check.ok(item)
}
