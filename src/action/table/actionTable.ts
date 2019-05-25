import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import AbilityService from "../../check/service/abilityService"
import EventService from "../../event/service/eventService"
import TimeService from "../../gameService/timeService"
import ItemService from "../../item/service/itemService"
import getHealerSpellTable from "../../mob/healer/healerSpellTable"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import EscrowService from "../../mob/trade/escrowService"
import SocialService from "../../player/service/socialService"
import WeatherService from "../../region/service/weatherService"
import {RequestType} from "../../request/enum/requestType"
import {ConditionMessages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import Action from "../impl/action"
import CastAction from "../impl/castAction"
import QuitAction from "../impl/client/quitAction"
import SleepAction from "../impl/disposition/sleepAction"
import WakeAction from "../impl/disposition/wakeAction"
import BountyAction from "../impl/fight/bountyAction"
import FleeAction from "../impl/fight/fleeAction"
import HitAction from "../impl/fight/hitAction"
import KillAction from "../impl/fight/killAction"
import LevelAction from "../impl/improve/levelAction"
import PracticeAction from "../impl/improve/practiceAction"
import TrainAction from "../impl/improve/trainAction"
import AffectsAction from "../impl/info/affectsAction"
import EquippedAction from "../impl/info/equippedAction"
import ExitsAction from "../impl/info/exitsAction"
import HelpAction from "../impl/info/helpAction"
import InventoryAction from "../impl/info/inventoryAction"
import LookAction from "../impl/info/lookAction"
import LoreAction from "../impl/info/loreAction"
import ScanAction from "../impl/info/scanAction"
import ScoreAction from "../impl/info/scoreAction"
import CloseItemAction from "../impl/item/closeItemAction"
import DropAction from "../impl/item/dropAction"
import EatAction from "../impl/item/eatAction"
import GetAction from "../impl/item/getAction"
import LootAction from "../impl/item/lootAction"
import OpenItemAction from "../impl/item/openItemAction"
import PutAction from "../impl/item/putAction"
import RemoveAction from "../impl/item/removeAction"
import SacrificeAction from "../impl/item/sacrificeAction"
import WearAction from "../impl/item/wearAction"
import CloseDoorAction from "../impl/manipulate/closeDoorAction"
import LockAction from "../impl/manipulate/lockAction"
import OpenDoorAction from "../impl/manipulate/openDoorAction"
import UnlockAction from "../impl/manipulate/unlockAction"
import BuyAction from "../impl/merchant/buyAction"
import HealAction from "../impl/merchant/healAction"
import ListAction from "../impl/merchant/listAction"
import SellAction from "../impl/merchant/sellAction"
import FollowAction from "../impl/mob/followAction"
import TradeRequestAction from "../impl/mob/tradeRequestAction"
import BanAction from "../impl/moderation/banAction"
import DemoteAction from "../impl/moderation/demoteAction"
import PromoteAction from "../impl/moderation/promoteAction"
import UnbanAction from "../impl/moderation/unbanAction"
import DownAction from "../impl/move/downAction"
import EastAction from "../impl/move/eastAction"
import NorthAction from "../impl/move/northAction"
import SouthAction from "../impl/move/southAction"
import UpAction from "../impl/move/upAction"
import WestAction from "../impl/move/westAction"
import MultiAction from "../impl/multiAction"
import NoopAction from "../impl/noopAction"
import backstabAction from "../impl/skill/ranger/backstabAction"
import detectTouchAction from "../impl/skill/ranger/detectTouchAction"
import dirtKickAction from "../impl/skill/ranger/dirtKickAction"
import envenomAction from "../impl/skill/ranger/envenomAction"
import eyeGougeAction from "../impl/skill/ranger/eyeGougeAction"
import garotteAction from "../impl/skill/ranger/garotteAction"
import hamstringAction from "../impl/skill/ranger/hamstringAction"
import peekAction from "../impl/skill/ranger/peekAction"
import sharpenAction from "../impl/skill/ranger/sharpenAction"
import sneakAction from "../impl/skill/ranger/sneakAction"
import stealAction from "../impl/skill/ranger/stealAction"
import bashAction from "../impl/skill/warrior/bashAction"
import berserkAction from "../impl/skill/warrior/berserkAction"
import disarmAction from "../impl/skill/warrior/disarmAction"
import shieldBashAction from "../impl/skill/warrior/shieldBashAction"
import tripAction from "../impl/skill/warrior/tripAction"
import GossipAction from "../impl/social/gossipAction"
import SayAction from "../impl/social/sayAction"
import TellAction from "../impl/social/tellAction"
import Spell from "../impl/spell"

/* tslint:disable */
export default function getActionTable(
  mobService: MobService,
  itemService: ItemService,
  timeService: TimeService,
  eventService: EventService,
  weatherService: WeatherService,
  spellTable: Spell[],
  locationService: LocationService,
  escrowService: EscrowService): Action[] {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const lookAction = new LookAction(locationService, itemService, timeService, weatherService)
  const socialService = new SocialService(checkBuilderFactory, eventService)
  const abilityService = new AbilityService(checkBuilderFactory, eventService)
  return [
    // moving
    new NorthAction(checkBuilderFactory, locationService),
    new SouthAction(checkBuilderFactory, locationService),
    new EastAction(checkBuilderFactory, locationService),
    new WestAction(checkBuilderFactory, locationService),
    new UpAction(checkBuilderFactory, locationService),
    new DownAction(checkBuilderFactory, locationService),

    // items
    new GetAction(checkBuilderFactory, itemService),
    new DropAction(checkBuilderFactory, eventService),
    new PutAction(checkBuilderFactory, itemService),
    new WearAction(checkBuilderFactory),
    new RemoveAction(checkBuilderFactory),
    new EatAction(checkBuilderFactory, eventService),
    new SacrificeAction(checkBuilderFactory, eventService),
    new LootAction(checkBuilderFactory),

    // multi-actions
    new MultiAction(
      RequestType.Close,
      ConditionMessages.All.Arguments.Close,
      [ ActionPart.Action, ActionPart.Target ],
      [
        new CloseItemAction(checkBuilderFactory),
        new CloseDoorAction(checkBuilderFactory),
      ]),
    new MultiAction(
      RequestType.Open,
      ConditionMessages.All.Arguments.Open,
      [ ActionPart.Action, ActionPart.Target ],
      [
        new OpenItemAction(checkBuilderFactory),
        new OpenDoorAction(checkBuilderFactory),
      ]),

    // manipulate
    new UnlockAction(checkBuilderFactory, itemService),
    new LockAction(checkBuilderFactory, itemService),

    // fighting
    new KillAction(checkBuilderFactory, eventService),
    new HitAction(checkBuilderFactory, eventService),
    new FleeAction(checkBuilderFactory, mobService, locationService),
    new BountyAction(checkBuilderFactory),

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
    detectTouchAction(abilityService),
    eyeGougeAction(abilityService),
    hamstringAction(abilityService),

    // casting
    new CastAction(checkBuilderFactory, spellTable),

    // info
    new ScanAction(checkBuilderFactory, mobService),
    new AffectsAction(),
    lookAction,
    new LoreAction(checkBuilderFactory, itemService),
    new ScoreAction(),
    new InventoryAction(itemService),
    new EquippedAction(),
    new ExitsAction(),
    new HelpAction(),

    // merchants/healers
    new BuyAction(checkBuilderFactory, eventService),
    new SellAction(checkBuilderFactory, eventService),
    new ListAction(checkBuilderFactory),
    new HealAction(checkBuilderFactory, locationService, getHealerSpellTable(spellTable)),

    // mob
    new FollowAction(checkBuilderFactory),
    new LevelAction(checkBuilderFactory),
    new TradeRequestAction(checkBuilderFactory, escrowService),

    // social
    new GossipAction(socialService),
    new SayAction(socialService),
    new TellAction(socialService),

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

    // client
    new QuitAction(checkBuilderFactory, eventService),

    // catch-all
    new NoopAction(),
  ]
}
