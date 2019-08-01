import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import AbilityService from "../../check/service/abilityService"
import EventService from "../../event/service/eventService"
import TimeService from "../../gameService/timeService"
import ItemService from "../../item/service/itemService"
import getHealerSpellTable from "../../mob/healer/healerSpellTable"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import EscrowService from "../../mob/trade/escrowService"
import PlayerService from "../../player/service/playerService"
import SocialService from "../../player/service/socialService"
import WeatherService from "../../region/service/weatherService"
import {RequestType} from "../../request/enum/requestType"
import RoomRepository from "../../room/repository/room"
import RealEstateService from "../../room/service/realEstateService"
import ClientService from "../../server/service/clientService"
import {ConditionMessages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import Action from "../impl/action"
import CastAction from "../impl/castAction"
import QuitAction from "../impl/client/quitAction"
import SitAction from "../impl/disposition/sitAction"
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
import OwnedAction from "../impl/info/ownedAction"
import ScanAction from "../impl/info/scanAction"
import ScoreAction from "../impl/info/scoreAction"
import WhoAction from "../impl/info/whoAction"
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
import RoomAcceptAction from "../impl/room/roomAcceptAction"
import RoomBidAction from "../impl/room/roomBidAction"
import RoomInfoAction from "../impl/room/roomInfoAction"
import RoomSellAction from "../impl/room/roomSellAction"
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
import GossipAction from "../impl/social/gossipAction"
import SayAction from "../impl/social/sayAction"
import TellAction from "../impl/social/tellAction"
import Spell from "../impl/spell"
import CcAddAction from "../impl/subscription/ccAddAction"
import CcListAction from "../impl/subscription/ccListAction"
import CcRemoveAction from "../impl/subscription/ccRemoveAction"
import SubscribeAction from "../impl/subscription/subscribeAction"
import UnsubscribeAction from "../impl/subscription/unsubscribeAction"

/* tslint:disable */
export default function getActionTable(
  mobService: MobService,
  itemService: ItemService,
  timeService: TimeService,
  eventService: EventService,
  weatherService: WeatherService,
  spellTable: Spell[],
  locationService: LocationService,
  escrowService: EscrowService,
  playerService: PlayerService,
  clientService: ClientService,
  realEstateService: RealEstateService,
  roomRepository: RoomRepository): Action[] {
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
    detectHiddenAction(abilityService),
    detectTouchAction(abilityService),
    eyeGougeAction(abilityService),
    hamstringAction(abilityService),
    repairAction(abilityService),
    enduranceAction(abilityService),

    // casting
    new CastAction(checkBuilderFactory, spellTable),

    // info
    new ScoreAction(),
    new ScanAction(checkBuilderFactory, mobService),
    new AffectsAction(),
    lookAction,
    new LoreAction(checkBuilderFactory, itemService),
    new InventoryAction(),
    new EquippedAction(),
    new ExitsAction(),
    new HelpAction(),
    new WhoAction(clientService),
    new OwnedAction(checkBuilderFactory),

    // rooms
    new RoomInfoAction(checkBuilderFactory),
    new RoomSellAction(checkBuilderFactory, realEstateService),
    new RoomBidAction(checkBuilderFactory, realEstateService),
    new RoomAcceptAction(checkBuilderFactory, realEstateService, mobService, clientService, roomRepository),

    // merchants/healers
    new BuyAction(checkBuilderFactory, eventService),
    new SellAction(checkBuilderFactory, eventService),
    new ListAction(checkBuilderFactory),
    new HealAction(checkBuilderFactory, locationService, getHealerSpellTable(spellTable)),

    // mob
    new FollowAction(checkBuilderFactory),
    new LevelAction(checkBuilderFactory, mobService),
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
