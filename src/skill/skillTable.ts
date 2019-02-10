import DodgeAction from "../action/impl/skill/event/dodgeAction"
import EnhancedDamageAction from "../action/impl/skill/event/enhancedDamageAction"
import FastHealingAction from "../action/impl/skill/event/fastHealingAction"
import SecondAttackAction from "../action/impl/skill/event/secondAttackAction"
import WeaponAction from "../action/impl/skill/weaponAction"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import EventService from "../event/eventService"
import MobService from "../mob/mobService"
import {SkillType} from "./skillType"

export function getSkillTable(mobService: MobService, eventService: EventService) {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  return [
    new DodgeAction(checkBuilderFactory, eventService),
    new SecondAttackAction(checkBuilderFactory, eventService),
    new EnhancedDamageAction(checkBuilderFactory, eventService),
    new FastHealingAction(checkBuilderFactory, eventService),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Sword),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Mace),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Wand),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Dagger),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Stave),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Whip),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Spear),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Axe),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Flail),
    new WeaponAction(checkBuilderFactory, eventService, SkillType.Polearm),
  ]
}
