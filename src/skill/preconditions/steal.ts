import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default async function(request: Request): Promise<Check> {
  const target = request.getTarget() as Mob
  const subject = request.getSubject()

  return request.checkWithStandingDisposition()
    .not().requireFight(Messages.All.Fighting)
    .requireMob(target)
    .requireSkill(SkillType.Steal)
    .requireLevel(5)
    .require(
      target ? target.inventory.findItemByName(subject) : false,
      Messages.Steal.ErrorNoItem,
      CheckType.HasItem)
    .addCost(new Cost(CostType.Mv, Costs.Steal.Mv))
    .addCost(new Cost(CostType.Delay, Costs.Steal.Delay))
    .create()
}
