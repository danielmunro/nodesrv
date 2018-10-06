import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import { Request } from "../../request/request"
import { MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE, Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  const mob = request.mob
  const item = mob.inventory.findItemByName(request.getContextAsInput().subject)

  if (!item) {
    return Check.fail(Messages.All.Item.NotOwned)
  }

  if (item.affects.find((affect) => affect.affectType === AffectType.Curse)) {
    return Check.fail(`A powerful curse on ${item.name} prevents you from relinquishing it!`)
  }

  if (!item.isTransferable) {
    return Check.fail(MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  }

  return Check.ok(item)
}
