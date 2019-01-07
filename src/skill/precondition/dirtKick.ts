import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import SkillDefinition from "../skillDefinition"

export default function(request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSkill(SkillType.DirtKick)
    .requireLevel(5)
    .requireFight()
    .addCost(new Cost(CostType.Mv, Costs.DirtKick.Mv, Messages.All.NotEnoughMv))
    .create()
}
