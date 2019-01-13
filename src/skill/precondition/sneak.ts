import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default async function(request: Request, service: GameService): Promise<Check> {
  return service.createDefaultCheckFor(request)
    .not().requireFight(Messages.All.Fighting)
    .requireSkill(SkillType.Sneak)
    .atLevelOrGreater(5)
    .addCost(new Cost(CostType.Mv, Costs.Sneak.Mv))
    .addCost(new Cost(CostType.Delay, Costs.Sneak.Delay))
    .create()
}
