import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSkill(SkillType.DirtKick)
    .requireFight()
    .addCost(new Cost(CostType.Mv, Costs.DirtKick.Mv, Messages.All.NotEnoughMv))
    .create()
}
