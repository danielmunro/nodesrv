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

    new BackstabAction(checkBuilderFactory, eventService),
    new DirtKickAction(checkBuilderFactory, eventService),
    new EnvenomAction(checkBuilderFactory, eventService),
    new HamstringAction(checkBuilderFactory, eventService),
    new SharpenAction(checkBuilderFactory, eventService),
    new SneakAction(checkBuilderFactory, eventService),
    new StealAction(checkBuilderFactory, eventService),

    new BashAction(checkBuilderFactory, eventService),
    new BerserkAction(checkBuilderFactory, eventService),
    new DisarmAction(checkBuilderFactory, eventService),
    new ShieldBashAction(checkBuilderFactory, eventService),
    new TripAction(checkBuilderFactory, eventService),

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
