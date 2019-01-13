import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { format } from "../../support/string"
import { MESSAGE_REMOVE_FAIL, Messages } from "./constants"

export default function(request: Request, gameService: GameService): Promise<Check> {
  const item = request.mob.equipped.findItemByName(request.getContextAsInput().subject)
  const replacement = item ? item.toString() : null
  return gameService.createDefaultCheckFor(request)
    .require(item, MESSAGE_REMOVE_FAIL, CheckType.HasItem)
    .capture()
    .not().requireAffect(AffectType.NoRemove,
      format(Messages.All.Item.NoRemoveItem, replacement))
    .not().requireAffect(AffectType.Curse,
      format(Messages.All.Item.CannotRemoveCursedItem, replacement))
    .create()
}
