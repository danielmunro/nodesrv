import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSkill(SkillType.Berserk)
    .requireLevel(20)
    .not(request.mob).requireAffect(AffectType.Berserk, Messages.Berserk.FailAlreadyInvoked)
    .addCost(
      new Cost(
        CostType.Mv,
        Math.max(request.mob.getCombinedAttributes().vitals.mv / 2, Costs.Berserk.Mv),
        Messages.All.NotEnoughMv))
    .addCost(new Cost(CostType.Delay, Costs.Berserk.Delay))
    .create()
}
