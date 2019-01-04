import Check from "../../check/check"
import GameService from "../../gameService/gameService"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import { SpellType } from "../spellType"

export default function(request: Request, service: GameService): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSpell(SpellType.CureLight)
    .optionalMob(request.getTarget() as Mob)
    .addManaCost(50)
    .create()
}
