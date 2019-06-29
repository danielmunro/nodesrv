import backstabAction from "../../action/impl/skill/assassin/backstabAction"
import envenomAction from "../../action/impl/skill/assassin/envenomAction"
import eyeGougeAction from "../../action/impl/skill/assassin/eyeGougeAction"
import garotteAction from "../../action/impl/skill/assassin/garotteAction"
import gougeAction from "../../action/impl/skill/assassin/gougeAction"
import hamstringAction from "../../action/impl/skill/assassin/hamstringAction"
import tripAction from "../../action/impl/skill/assassin/tripAction"
import bashAction from "../../action/impl/skill/brawler/bashAction"
import bludgeonAction from "../../action/impl/skill/brawler/bludgeonAction"
import cleaveAction from "../../action/impl/skill/brawler/cleaveAction"
import enhancedDamageAction from "../../action/impl/skill/brawler/enhancedDamageAction"
import secondAttackAction from "../../action/impl/skill/brawler/secondAttackAction"
import shieldBashAction from "../../action/impl/skill/brawler/shieldBashAction"
import thirdAttackAction from "../../action/impl/skill/brawler/thirdAttackAction"
import sharpenAction from "../../action/impl/skill/crafting/sharpenAction"
import detectTouchAction from "../../action/impl/skill/detection/detectTouchAction"
import fastHealingAction from "../../action/impl/skill/endurance/fastHealingAction"
import dirtKickAction from "../../action/impl/skill/evasion/dirtKickAction"
import dodgeAction from "../../action/impl/skill/evasion/dodgeAction"
import parryAction from "../../action/impl/skill/evasion/parryAction"
import shieldBlockAction from "../../action/impl/skill/evasion/shieldBlockAction"
import peekAction from "../../action/impl/skill/thief/peekAction"
import sneakAction from "../../action/impl/skill/thief/sneakAction"
import stealAction from "../../action/impl/skill/thief/stealAction"
import berserkAction from "../../action/impl/skill/warrior/berserkAction"
import disarmAction from "../../action/impl/skill/warrior/disarmAction"
import weaponAction from "../../action/impl/skill/weaponAction"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import AbilityService from "../../check/service/abilityService"
import EventService from "../../event/service/eventService"
import MobService from "../service/mobService"
import {SkillType} from "./skillType"

export function getSkillTable(mobService: MobService, eventService: EventService) {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const abilityService = new AbilityService(checkBuilderFactory, eventService)
  return [
    dodgeAction(abilityService),
    secondAttackAction(abilityService),
    thirdAttackAction(abilityService),
    enhancedDamageAction(abilityService),
    fastHealingAction(abilityService),
    shieldBlockAction(abilityService),
    parryAction(abilityService),

    backstabAction(abilityService),
    dirtKickAction(abilityService),
    envenomAction(abilityService),
    hamstringAction(abilityService),
    sharpenAction(abilityService),
    sneakAction(abilityService),
    stealAction(abilityService),
    peekAction(abilityService),
    garotteAction(abilityService),
    detectTouchAction(abilityService),
    eyeGougeAction(abilityService),
    bashAction(abilityService),
    berserkAction(abilityService),
    disarmAction(abilityService),
    shieldBashAction(abilityService),
    tripAction(abilityService),
    bludgeonAction(abilityService),
    cleaveAction(abilityService),
    gougeAction(abilityService),

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
