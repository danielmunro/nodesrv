import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  return service.createDefaultCheckFor(request)
    .requireSkill(SkillType.Trip)
    .atLevelOrGreater(10)
    .requireFight()
    .capture()
    .addCost(new Cost(CostType.Mv, Costs.Trip.Mv, Messages.All.NotEnoughMv))
    .addCost(new Cost(CostType.Delay, Costs.Trip.Delay))
    .create()
}
