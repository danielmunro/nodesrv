import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default function(request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return service.createDefaultCheckFor(request)
    .requireSkill(SkillType.DirtKick)
    .atLevelOrGreater(5)
    .requireFight()
    .addCost(new Cost(CostType.Mv, Costs.DirtKick.Mv, Messages.All.NotEnoughMv))
    .create()
}
