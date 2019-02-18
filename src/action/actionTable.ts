import CheckBuilderFactory from "../check/checkBuilderFactory"
import EventService from "../event/eventService"
import SocialService from "../gameService/socialService"
import TimeService from "../gameService/timeService"
import ItemService from "../item/itemService"
import getHealerSpellTable from "../mob/healer/healerSpellTable"
import MobService from "../mob/mobService"
import {RequestType} from "../request/requestType"
import Action from "./action"
import {ConditionMessages} from "./constants"
import {ActionPart} from "./enum/actionPart"
import CastAction from "./impl/castAction"
import SleepAction from "./impl/disposition/sleepAction"
import WakeAction from "./impl/disposition/wakeAction"
import BountyAction from "./impl/fight/bountyAction"
import FleeAction from "./impl/fight/fleeAction"
import HitAction from "./impl/fight/hitAction"
import KillAction from "./impl/fight/killAction"
import AffectsAction from "./impl/info/affectsAction"
import EquippedAction from "./impl/info/equippedAction"
import ExitsAction from "./impl/info/exitsAction"
import HelpAction from "./impl/info/helpAction"
import InventoryAction from "./impl/info/inventoryAction"
import LookAction from "./impl/info/lookAction"
import LoreAction from "./impl/info/loreAction"
import ScoreAction from "./impl/info/scoreAction"
import CloseItemAction from "./impl/item/closeItemAction"
import DropAction from "./impl/item/dropAction"
import EatAction from "./impl/item/eatAction"
import GetAction from "./impl/item/getAction"
import OpenItemAction from "./impl/item/openItemAction"
import PutAction from "./impl/item/putAction"
import RemoveAction from "./impl/item/removeAction"
import SacrificeAction from "./impl/item/sacrificeAction"
import WearAction from "./impl/item/wearAction"
import CloseDoorAction from "./impl/manipulate/closeDoorAction"
import LockAction from "./impl/manipulate/lockAction"
import OpenDoorAction from "./impl/manipulate/openDoorAction"
import UnlockAction from "./impl/manipulate/unlockAction"
import BuyAction from "./impl/merchant/buyAction"
import HealAction from "./impl/merchant/healAction"
import ListAction from "./impl/merchant/listAction"
import SellAction from "./impl/merchant/sellAction"
import BanAction from "./impl/moderation/banAction"
import DemoteAction from "./impl/moderation/demoteAction"
import PromoteAction from "./impl/moderation/promoteAction"
import UnbanAction from "./impl/moderation/unbanAction"
import DownAction from "./impl/move/downAction"
import EastAction from "./impl/move/eastAction"
import NorthAction from "./impl/move/northAction"
import SouthAction from "./impl/move/southAction"
import UpAction from "./impl/move/upAction"
import WestAction from "./impl/move/westAction"
import MultiAction from "./impl/multiAction"
import NoopAction from "./impl/noopAction"
import BackstabAction from "./impl/skill/backstabAction"
import BashAction from "./impl/skill/bashAction"
import BerserkAction from "./impl/skill/berserkAction"
import DirtKickAction from "./impl/skill/dirtKickAction"
import DisarmAction from "./impl/skill/disarmAction"
import EnvenomAction from "./impl/skill/envenomAction"
import HamstringAction from "./impl/skill/hamstringAction"
import SharpenAction from "./impl/skill/sharpenAction"
import SneakAction from "./impl/skill/sneakAction"
import StealAction from "./impl/skill/stealAction"
import TripAction from "./impl/skill/tripAction"
import GossipAction from "./impl/social/gossipAction"
import SayAction from "./impl/social/sayAction"
import TellAction from "./impl/social/tellAction"
import TrainAction from "./impl/trainAction"
import Spell from "./spell"

export default function getActionTable(
  mobService: MobService,
  itemService: ItemService,
  timeService: TimeService,
  eventService: EventService,
  spellTable: Spell[]): Action[] {
  const locationService = mobService.locationService
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  const lookAction = new LookAction(locationService, itemService, timeService)
  const socialService = new SocialService(checkBuilderFactory, eventService)
  return [
    // moving
    new NorthAction(checkBuilderFactory, locationService, lookAction),
    new SouthAction(checkBuilderFactory, locationService, lookAction),
    new EastAction(checkBuilderFactory, locationService, lookAction),
    new WestAction(checkBuilderFactory, locationService, lookAction),
    new UpAction(checkBuilderFactory, locationService, lookAction),
    new DownAction(checkBuilderFactory, locationService, lookAction),

    // items
    new GetAction(checkBuilderFactory, itemService),
    new DropAction(checkBuilderFactory, eventService),
    new PutAction(checkBuilderFactory, itemService),
    new WearAction(checkBuilderFactory),
    new RemoveAction(checkBuilderFactory),
    new EatAction(checkBuilderFactory, eventService),
    new SacrificeAction(checkBuilderFactory, eventService),

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
    new OpenDoorAction(checkBuilderFactory),
    new UnlockAction(checkBuilderFactory, itemService),
    new LockAction(checkBuilderFactory, itemService),

    // fighting
    new KillAction(checkBuilderFactory, eventService),
    new HitAction(checkBuilderFactory, eventService),
    new FleeAction(checkBuilderFactory, mobService, locationService),
    new HamstringAction(checkBuilderFactory, eventService),
    new BountyAction(checkBuilderFactory, mobService),

    // skills
    new BackstabAction(checkBuilderFactory, eventService),
    new BashAction(checkBuilderFactory, eventService),
    new BerserkAction(checkBuilderFactory, eventService),
    new DirtKickAction(checkBuilderFactory, eventService),
    new DisarmAction(checkBuilderFactory, eventService),
    new TripAction(checkBuilderFactory, eventService),
    new EnvenomAction(checkBuilderFactory, eventService),
    new SharpenAction(checkBuilderFactory, eventService),
    new SneakAction(checkBuilderFactory, eventService),
    new StealAction(checkBuilderFactory, eventService),

    // casting
    new CastAction(checkBuilderFactory, spellTable),

    // info
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

    // social
    new GossipAction(socialService),
    new SayAction(socialService),
    new TellAction(socialService),

    // training
    new TrainAction(checkBuilderFactory, locationService),

    // // moderation
    new BanAction(checkBuilderFactory, mobService),
    new UnbanAction(checkBuilderFactory, mobService),
    new PromoteAction(checkBuilderFactory, mobService),
    new DemoteAction(checkBuilderFactory, mobService),

    // disposition
    new WakeAction(checkBuilderFactory),
    new SleepAction(checkBuilderFactory),

    // catch-all
    new NoopAction(),
  ]
}
