import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import appetite from "../../mob/race/appetite"
import { Request } from "../../request/request"
import {Messages} from "./constants"

export default function(request: Request, gameService: GameService): Promise<Check> {
  return gameService.createCheckFor(request.mob)
    .requireSubject(request, Messages.All.Arguments.Eat)
    .require(request.findItemInSessionMobInventory(), Messages.All.Item.NotOwned)
    .capture()
    .require(captured => captured.isFood(), Messages.Eat.NotFood)
    .require(request.mob.playerMob.hunger < appetite(request.mob.race), Messages.Eat.AlreadyFull)
    .create()
}
