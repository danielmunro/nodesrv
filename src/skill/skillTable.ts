import dodgeAction from "../action/impl/skill/event/dodgeAction"
import enhancedDamageAction from "../action/impl/skill/event/enhancedDamageAction"
import fastHealingAction from "../action/impl/skill/event/fastHealingAction"
import secondAttackAction from "../action/impl/skill/event/secondAttackAction"
import shieldBlockAction from "../action/impl/skill/event/shieldBlockAction"
import backstabAction from "../action/impl/skill/ranger/backstabAction"
import dirtKickAction from "../action/impl/skill/ranger/dirtKickAction"
import envenomAction from "../action/impl/skill/ranger/envenomAction"
import hamstringAction from "../action/impl/skill/ranger/hamstringAction"
import sharpenAction from "../action/impl/skill/ranger/sharpenAction"
import sneakAction from "../action/impl/skill/ranger/sneakAction"
import stealAction from "../action/impl/skill/ranger/stealAction"
import bashAction from "../action/impl/skill/warrior/bashAction"
import berserkAction from "../action/impl/skill/warrior/berserkAction"
import disarmAction from "../action/impl/skill/warrior/disarmAction"
import shieldBashAction from "../action/impl/skill/warrior/shieldBashAction"
import tripAction from "../action/impl/skill/warrior/tripAction"
import weaponAction from "../action/impl/skill/weaponAction"
import AbilityService from "../check/abilityService"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import EventService from "../event/eventService"
import MobService from "../mob/mobService"
import {SkillType} from "./skillType"

export function getSkillTable(mobService: MobService, eventService: EventService) {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const abilityService = new AbilityService(checkBuilderFactory, eventService)
  return [
    dodgeAction(abilityService),
    secondAttackAction(abilityService),
    enhancedDamageAction(abilityService),
    fastHealingAction(abilityService),
    shieldBlockAction(abilityService),

    backstabAction(abilityService),
    dirtKickAction(abilityService),
    envenomAction(abilityService),
    hamstringAction(abilityService),
    sharpenAction(abilityService),
    sneakAction(abilityService),
    stealAction(abilityService),

    bashAction(abilityService),
    berserkAction(abilityService),
    disarmAction(abilityService),
    shieldBashAction(abilityService),
    tripAction(abilityService),

    weaponAction(abilityService, SkillType.Sword),
    weaponAction(abilityService, SkillType.Mace),
    weaponAction(abilityService, SkillType.Wand),
    weaponAction(abilityService, SkillType.Dagger),
    weaponAction(abilityService, SkillType.Stave),
    weaponAction(abilityService, SkillType.Whip),
    weaponAction(abilityService, SkillType.Spear),
    weaponAction(abilityService, SkillType.Axe),
    weaponAction(abilityService, SkillType.Flail),
    weaponAction(abilityService, SkillType.Polearm),
  ]
}
