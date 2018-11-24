import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default async function(request: Request, service: Service): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .not().requireFight(Messages.All.Fighting)
    .requireSkill(SkillType.Sneak)
    .requireLevel(5)
    .addCost(new Cost(CostType.Mv, Costs.Sneak.Mv))
    .addCost(new Cost(CostType.Delay, Costs.Sneak.Delay))
    .create()
}
