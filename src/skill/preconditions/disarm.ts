import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Equipment } from "../../item/equipment"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSkill(SkillType.Disarm)
    .requireFight()
    .require(
      opponent => opponent.equipped.inventory.find(i => i.equipment === Equipment.Weapon),
      Messages.Disarm.FailNothingToDisarm)
    .addCost(new Cost(CostType.Mv, Costs.Disarm.Mv, Messages.All.NotEnoughMv))
    .addCost(new Cost(CostType.Delay, Costs.Disarm.Delay))
    .create()
}
