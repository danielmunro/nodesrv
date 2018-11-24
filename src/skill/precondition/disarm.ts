import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import { Equipment } from "../../item/equipment"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSkill(SkillType.Disarm)
    .requireLevel(10)
    .requireFight()
    .require(
      opponent => opponent.equipped.find(i => i.equipment === Equipment.Weapon),
      Messages.Disarm.FailNothingToDisarm,
      CheckType.ItemPresent)
    .addCost(new Cost(CostType.Mv, Costs.Disarm.Mv, Messages.All.NotEnoughMv))
    .addCost(new Cost(CostType.Delay, Costs.Disarm.Delay))
    .create()
}
