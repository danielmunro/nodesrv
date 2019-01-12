import {AffectType} from "../../affect/affectType"
import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import {Messages} from "./constants"

export default function(request: Request, gameService: GameService): Promise<Check> {
  return gameService.createCheckFor(request.mob)
    .requireSubject(request, Messages.All.Arguments.Drop)
    .require(request.findItemInSessionMobInventory(request.getSubject()), Messages.All.Item.NotOwned)
    .capture()
    .not().requireAffect(AffectType.Curse, () => Messages.All.Item.CannotRemoveCursedItem)
    .require(captured => captured.isTransferable, () => Messages.All.Item.NotTransferrable)
    .create()
}
