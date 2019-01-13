import Check from "../../check/check"
import {CheckType} from "../../check/checkType"
import Cost from "../../check/cost/cost"
import {CostType} from "../../check/cost/costType"
import GameService from "../../gameService/gameService"
import {Mob} from "../../mob/model/mob"
import {Request} from "../../request/request"
import {Costs} from "../constants"
import SkillDefinition from "../skillDefinition"
import {SkillType} from "../skillType"
import {Messages} from "./constants"

export default async function(
  request: Request, skillDefinition: SkillDefinition, service: GameService): Promise<Check> {
  const target = request.getTarget() as Mob
  const subject = request.getSubject()

  return service.createDefaultCheckFor(request)
    .not().requireFight(Messages.All.Fighting)
    .require(target, Messages.All.NoTarget, CheckType.HasTarget)
    .requireSkill(SkillType.Steal)
    .atLevelOrGreater(5)
    .require(
      target ? target.inventory.findItemByName(subject) : false,
      Messages.Steal.ErrorNoItem,
      CheckType.HasItem)
    .addCost(new Cost(CostType.Mv, Costs.Steal.Mv))
    .addCost(new Cost(CostType.Delay, Costs.Steal.Delay))
    .create()
}
