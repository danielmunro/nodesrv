import DodgeAction from "../action/impl/skill/event/dodgeAction"
import EnhancedDamageAction from "../action/impl/skill/event/enhancedDamageAction"
import FastHealingAction from "../action/impl/skill/event/fastHealingAction"
import SecondAttackAction from "../action/impl/skill/event/secondAttackAction"
import WeaponAction from "../action/impl/skill/weaponAction"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import GameService from "../gameService/gameService"
import {SkillType} from "./skillType"

export function getSkillTable(service: GameService) {
  const checkBuilderFactory = new CheckBuilderFactory(service.mobService)
  return [
    new DodgeAction(checkBuilderFactory),
    new SecondAttackAction(checkBuilderFactory),
    new EnhancedDamageAction(checkBuilderFactory),
    new FastHealingAction(checkBuilderFactory),
    new WeaponAction(checkBuilderFactory, SkillType.Sword),
    new WeaponAction(checkBuilderFactory, SkillType.Mace),
    new WeaponAction(checkBuilderFactory, SkillType.Wand),
    new WeaponAction(checkBuilderFactory, SkillType.Dagger),
    new WeaponAction(checkBuilderFactory, SkillType.Stave),
    new WeaponAction(checkBuilderFactory, SkillType.Whip),
    new WeaponAction(checkBuilderFactory, SkillType.Spear),
    new WeaponAction(checkBuilderFactory, SkillType.Axe),
    new WeaponAction(checkBuilderFactory, SkillType.Flail),
    new WeaponAction(checkBuilderFactory, SkillType.Polearm),
  ]
}
