import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSkill(SkillType.Bash)
    .requireLevel(5)
    .requireFight()
    .addCost(new Cost(CostType.Mv, Costs.Bash.Mv, Messages.All.NotEnoughMv))
    .create()
}
