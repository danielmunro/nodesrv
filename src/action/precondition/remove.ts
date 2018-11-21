import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import { format } from "../../support/string"
import { MESSAGE_REMOVE_FAIL, Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  const item = request.mob.equipped.findItemByName(request.getContextAsInput().subject)
  const replacement = item ? item.toString() : null
  return new CheckBuilder()
    .require(item, MESSAGE_REMOVE_FAIL, CheckType.HasItem)
    .capture()
    .not().requireAffect(AffectType.NoRemove,
      format(Messages.All.Item.NoRemoveItem, replacement))
    .not().requireAffect(AffectType.Curse,
      format(Messages.All.Item.CannotRemoveCursedItem, replacement))
    .create()
}
