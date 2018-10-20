import Check from "../../check/check"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import { CheckType } from "../../check/checkType"
import { AffectType } from "../../affect/affectType"
import { Item } from "../../item/model/item"
import { Equipment } from "../../item/equipment"

export default async function(request: Request): Promise<Check> {
  const target = request.getTarget() as Item

  return request.checkWithStandingDisposition()
    .not().requireFight(Messages.All.Fighting)
    .requireSkill(SkillType.Sharpen)
    .requireLevel(10)
    .require(target, Messages.All.NoItem, CheckType.HasItem)
    .require(
      !target.affects.find(affect => affect.affectType === AffectType.Sharpened),
      Messages.Sharpen.AlreadySharpened)
    .require(
      target.equipment === Equipment.Weapon,
      Messages.Sharpen.NotAWeapon)
    .addCost(new Cost(CostType.Mana, Costs.Sharpen.Mana))
    .addCost(new Cost(CostType.Mv, Costs.Sharpen.Mv))
    .addCost(new Cost(CostType.Delay, Costs.Sharpen.Delay))
    .create()
}
