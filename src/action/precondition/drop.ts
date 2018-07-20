import { AffectType } from "../../affect/affectType"
import { Request } from "../../request/request"
import Check from "../check"
import { MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE } from "./get"

export const MESSAGE_FAIL_NO_ITEM = "You don't have that."

export default function(request: Request): Promise<Check> {
  const mob = request.player.sessionMob
  const item = mob.inventory.findItemByName(request.subject)

  if (!item) {
    return Check.fail(MESSAGE_FAIL_NO_ITEM)
  }

  if (item.affects.find((affect) => affect.affectType === AffectType.Curse)) {
    return Check.fail(`A powerful curse on ${item.name} prevents you from relinquishing it!`)
  }

  if (!item.isTransferable) {
    return Check.fail(MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  }

  return Check.ok(item)
}
