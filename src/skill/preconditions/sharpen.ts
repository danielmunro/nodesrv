import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import { CheckType } from "../../check/checkType"
import Cost from "../../check/cost/cost"
import { CostType } from "../../check/cost/costType"
import { DamageType } from "../../damage/damageType"
import Weapon from "../../item/model/weapon"
import { Request } from "../../request/request"
import { Costs } from "../constants"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

export default async function(request: Request): Promise<Check> {
  const target = request.getTarget()

  return request.checkWithStandingDisposition()
    .not().requireFight(Messages.All.Fighting)
    .requireSkill(SkillType.Sharpen)
    .requireLevel(10)
    .require(target, Messages.All.NoItem, CheckType.HasItem)
    .capture()
    .require(
      weapon => !weapon.affects.find(affect => affect.affectType === AffectType.Sharpened),
      Messages.Sharpen.AlreadySharpened)
    .require(
      weapon => weapon instanceof Weapon,
      Messages.Sharpen.NotAWeapon)
    .require(
      weapon => weapon.damageType === DamageType.Slash,
      Messages.Sharpen.NotABladedWeapon)
    .addCost(new Cost(CostType.Mana, Costs.Sharpen.Mana))
    .addCost(new Cost(CostType.Mv, Costs.Sharpen.Mv))
    .addCost(new Cost(CostType.Delay, Costs.Sharpen.Delay))
    .create()
}
