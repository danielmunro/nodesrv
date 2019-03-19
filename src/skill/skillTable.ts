import DodgeAction from "../action/impl/skill/event/dodgeAction"
import EnhancedDamageAction from "../action/impl/skill/event/enhancedDamageAction"
import FastHealingAction from "../action/impl/skill/event/fastHealingAction"
import SecondAttackAction from "../action/impl/skill/event/secondAttackAction"
import BackstabAction from "../action/impl/skill/ranger/backstabAction"
import DirtKickAction from "../action/impl/skill/ranger/dirtKickAction"
import EnvenomAction from "../action/impl/skill/ranger/envenomAction"
import HamstringAction from "../action/impl/skill/ranger/hamstringAction"
import SharpenAction from "../action/impl/skill/ranger/sharpenAction"
import SneakAction from "../action/impl/skill/ranger/sneakAction"
import StealAction from "../action/impl/skill/ranger/stealAction"
import BashAction from "../action/impl/skill/warrior/bashAction"
import BerserkAction from "../action/impl/skill/warrior/berserkAction"
import DisarmAction from "../action/impl/skill/warrior/disarmAction"
import ShieldBashAction from "../action/impl/skill/warrior/shieldBashAction"
import TripAction from "../action/impl/skill/warrior/tripAction"
import WeaponAction from "../action/impl/skill/weaponAction"
import AbilityService from "../check/abilityService"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import EventService from "../event/eventService"
import MobService from "../mob/mobService"
import {SkillType} from "./skillType"

export function getSkillTable(mobService: MobService, eventService: EventService) {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const abilityService = new AbilityService(checkBuilderFactory, eventService)
  return [
    new DodgeAction(abilityService),
    new SecondAttackAction(abilityService),
    new EnhancedDamageAction(abilityService),
    new FastHealingAction(abilityService),

    new BackstabAction(abilityService),
    new DirtKickAction(abilityService),
    new EnvenomAction(abilityService),
    new HamstringAction(abilityService),
    new SharpenAction(abilityService),
    new SneakAction(abilityService),
    new StealAction(abilityService),

    new BashAction(abilityService),
    new BerserkAction(abilityService),
    new DisarmAction(abilityService),
    new ShieldBashAction(abilityService),
    new TripAction(abilityService),

    new WeaponAction(abilityService, SkillType.Sword),
    new WeaponAction(abilityService, SkillType.Mace),
    new WeaponAction(abilityService, SkillType.Wand),
    new WeaponAction(abilityService, SkillType.Dagger),
    new WeaponAction(abilityService, SkillType.Stave),
    new WeaponAction(abilityService, SkillType.Whip),
    new WeaponAction(abilityService, SkillType.Spear),
    new WeaponAction(abilityService, SkillType.Axe),
    new WeaponAction(abilityService, SkillType.Flail),
    new WeaponAction(abilityService, SkillType.Polearm),
  ]
}
