import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default async function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .not().requireFight(Messages.All.Fighting)
    .requireSkill(SkillType.Sneak)
    .requireLevel(5)
    .addCost(new Cost(CostType.Mv, Costs.Sneak.Mv))
    .addCost(new Cost(CostType.Delay, Costs.Sneak.Delay))
    .create()
}
