import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import { SpellType } from "../spellType"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSpell(SpellType.LightningBolt)
    .requireMob(request.getTarget() as Mob)
    .requireLevel(5)
    .addCost(new Cost(CostType.Mana, 50))
    .create()
}
