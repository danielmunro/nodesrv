import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
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
    .requireSkill(SkillType.Envenom)
    .atLevelOrGreater(15)
    .require(
      request.findItemInSessionMobInventory(),
      Messages.All.NoItem,
      CheckType.HasItem)
    .addCost(new Cost(CostType.Mana, Costs.Envenom.Mana))
    .create()
}
