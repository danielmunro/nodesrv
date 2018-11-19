import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import { CheckType } from "../../check/checkType"
import { Request } from "../../request/request"
import { format } from "../../support/string"
import { MESSAGE_REMOVE_FAIL, Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  const item = request.mob.equipped.inventory.findItemByName(request.getContextAsInput().subject)
  return new CheckBuilder()
    .require(
      item,
      MESSAGE_REMOVE_FAIL,
      CheckType.HasItem)
    .not().requireAffect(AffectType.Curse,
      format(Messages.All.Item.CannotRemoveCursedItem,  item ? item.toString() : null))
    .create()
}
