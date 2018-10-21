import { Request } from "../../request/request"
import Check from "../../check/check"
import { SpellType } from "../spellType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Mob } from "../../mob/model/mob"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSpell(SpellType.MagicMissile)
    .requireMob(request.getTarget() as Mob)
    .addCost(new Cost(CostType.Mana, 50))
    .create()
}
