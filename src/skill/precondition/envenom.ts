import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSkill(SkillType.Envenom)
    .requireLevel(15)
    .require(
      request.findItemInSessionMobInventory(),
      Messages.All.NoItem,
      CheckType.HasItem)
    .addCost(new Cost(CostType.Mana, Costs.Envenom.Mana))
    .create()
}
