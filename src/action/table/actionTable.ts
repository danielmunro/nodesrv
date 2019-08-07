import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import AbilityService from "../../check/service/abilityService"
import EventService from "../../event/service/eventService"
import getHealerSpellTable from "../../mob/healer/healerSpellTable"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import Action from "../impl/action"
import HealAction from "../impl/merchant/healAction"
import NoopAction from "../impl/noopAction"
import envenomAction from "../impl/skill/assassin/envenomAction"
import eyeGougeAction from "../impl/skill/assassin/eyeGougeAction"
import garotteAction from "../impl/skill/assassin/garotteAction"
import hamstringAction from "../impl/skill/assassin/hamstringAction"
import tripAction from "../impl/skill/assassin/tripAction"
import bashAction from "../impl/skill/brawler/bashAction"
import shieldBashAction from "../impl/skill/brawler/shieldBashAction"
import repairAction from "../impl/skill/crafting/repairAction"
import sharpenAction from "../impl/skill/crafting/sharpenAction"
import detectHiddenAction from "../impl/skill/detection/detectHiddenAction"
import detectTouchAction from "../impl/skill/detection/detectTouchAction"
import enduranceAction from "../impl/skill/endurance/enduranceAction"
import dirtKickAction from "../impl/skill/evasion/dirtKickAction"
import peekAction from "../impl/skill/thief/peekAction"
import sneakAction from "../impl/skill/thief/sneakAction"
import stealAction from "../impl/skill/thief/stealAction"
import berserkAction from "../impl/skill/warrior/berserkAction"
import disarmAction from "../impl/skill/warrior/disarmAction"
import Spell from "../impl/spell"

/* tslint:disable */
export default function getActionTable(
  mobService: MobService,
  eventService: EventService,
  spellTable: Spell[],
  locationService: LocationService): Action[] {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const abilityService = new AbilityService(checkBuilderFactory, eventService)
  return [
    // skills
    bashAction(abilityService),
    berserkAction(abilityService),
    dirtKickAction(abilityService),
    disarmAction(abilityService),
    tripAction(abilityService),
    envenomAction(abilityService),
    sharpenAction(abilityService),
    sneakAction(abilityService),
    stealAction(abilityService),
    shieldBashAction(abilityService),
    peekAction(abilityService),
    garotteAction(abilityService),
    detectHiddenAction(abilityService),
    detectTouchAction(abilityService),
    eyeGougeAction(abilityService),
    hamstringAction(abilityService),
    repairAction(abilityService),
    enduranceAction(abilityService),

    // merchants/healers
    new HealAction(checkBuilderFactory, locationService, getHealerSpellTable(spellTable)),

    // catch-all
    new NoopAction(),
  ]
}
