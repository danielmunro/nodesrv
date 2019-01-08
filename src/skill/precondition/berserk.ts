import Check from "../../check/check"
import CheckTemplate from "../../check/checkTemplate"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import SkillDefinition from "../skillDefinition"
import { Messages } from "./constants"

export default function(request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  return new CheckTemplate(service.mobService, request)
    .perform(skillDefinition)
    .addCost(
      new Cost(
        CostType.Mv,
        Math.max(request.mob.getCombinedAttributes().vitals.mv / 2, Costs.Berserk.Mv),
        Messages.All.NotEnoughMv))
    .create()
}
