import { Request } from "../../request/request"
import Check from "../check/check"
import { MESSAGE_FAIL_ITEM_NOT_IN_ROOM, MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE } from "./constants"

export default function(request: Request): Promise<Check> {
  const mob = request.player.sessionMob
  const item = mob.room.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_FAIL_ITEM_NOT_IN_ROOM)
  }

  if (!item.isTransferable) {
    return Check.fail(MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  }

  return Check.ok(item)
}
