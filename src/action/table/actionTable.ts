import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import AbilityService from "../../check/service/abilityService"
import EventService from "../../event/service/eventService"
import getHealerSpellTable from "../../mob/healer/healerSpellTable"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import PlayerService from "../../player/service/playerService"
import SocialService from "../../player/service/socialService"
import Action from "../impl/action"
import QuitAction from "../impl/client/quitAction"
import SitAction from "../impl/disposition/sitAction"
import SleepAction from "../impl/disposition/sleepAction"
import WakeAction from "../impl/disposition/wakeAction"
import PracticeAction from "../impl/improve/practiceAction"
import TrainAction from "../impl/improve/trainAction"
import HealAction from "../impl/merchant/healAction"
import BanAction from "../impl/moderation/banAction"
import DemoteAction from "../impl/moderation/demoteAction"
import PromoteAction from "../impl/moderation/promoteAction"
import UnbanAction from "../impl/moderation/unbanAction"
import NoopAction from "../impl/noopAction"
import backstabAction from "../impl/skill/assassin/backstabAction"
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
import CcAddAction from "../impl/subscription/ccAddAction"
import CcListAction from "../impl/subscription/ccListAction"
import CcRemoveAction from "../impl/subscription/ccRemoveAction"
import SubscribeAction from "../impl/subscription/subscribeAction"
import UnsubscribeAction from "../impl/subscription/unsubscribeAction"

/* tslint:disable */
export default function getActionTable(
  mobService: MobService,
  eventService: EventService,
  spellTable: Spell[],
  locationService: LocationService,
  playerService: PlayerService): Action[] {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const socialService = new SocialService(checkBuilderFactory, eventService)
  const abilityService = new AbilityService(checkBuilderFactory, eventService)
  return [
    // skills
    backstabAction(abilityService),
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

    // improve
    new TrainAction(checkBuilderFactory, locationService),
    new PracticeAction(checkBuilderFactory, mobService),

    // // moderation
    new BanAction(checkBuilderFactory, mobService),
    new UnbanAction(checkBuilderFactory, mobService),
    new PromoteAction(checkBuilderFactory, mobService),
    new DemoteAction(checkBuilderFactory, mobService),

    // disposition
    new WakeAction(checkBuilderFactory),
    new SleepAction(checkBuilderFactory),
    new SitAction(checkBuilderFactory),

    // client
    new QuitAction(checkBuilderFactory, eventService),

    // cc
    new CcListAction(checkBuilderFactory, playerService),
    new CcAddAction(checkBuilderFactory, playerService),
    new CcRemoveAction(checkBuilderFactory, playerService),

    // subscription
    new SubscribeAction(checkBuilderFactory, playerService),
    new UnsubscribeAction(checkBuilderFactory, playerService),

    // catch-all
    new NoopAction(),
  ]
}
