import CheckBuilderFactory from "../check/checkBuilderFactory"
import GameService from "../gameService/gameService"
import getHealerSpellTable from "../mob/healer/healerSpellTable"
import SocialService from "../social/socialService"
import getSpellTable from "../spell/spellTable"
import Action from "./action"
import CastAction from "./impl/castAction"
import SleepAction from "./impl/disposition/sleepAction"
import WakeAction from "./impl/disposition/wakeAction"
import FleeAction from "./impl/fight/fleeAction"
import HitAction from "./impl/fight/hitAction"
import KillAction from "./impl/fight/killAction"
import AffectsAction from "./impl/info/affectsAction"
import EquippedAction from "./impl/info/equippedAction"
import ExitsAction from "./impl/info/exitsAction"
import InventoryAction from "./impl/info/inventoryAction"
import LookAction from "./impl/info/lookAction"
import LoreAction from "./impl/info/loreAction"
import ScoreAction from "./impl/info/scoreAction"
import DropAction from "./impl/item/dropAction"
import EatAction from "./impl/item/eatAction"
import GetAction from "./impl/item/getAction"
import PutAction from "./impl/item/putAction"
import RemoveAction from "./impl/item/removeAction"
import SacrificeAction from "./impl/item/sacrificeAction"
import WearAction from "./impl/item/wearAction"
import CloseAction from "./impl/manipulate/closeAction"
import LockAction from "./impl/manipulate/lockAction"
import OpenAction from "./impl/manipulate/openAction"
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

export default function getActionTable(service: GameService): Action[] {
  const locationService = service.mobService.locationService
  const { mobService, itemService, timeService, eventService } = service
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

    // manipulate
    new CloseAction(checkBuilderFactory),
    new OpenAction(checkBuilderFactory),
    new UnlockAction(checkBuilderFactory, itemService),
    new LockAction(checkBuilderFactory, itemService),

    // fighting
    new KillAction(checkBuilderFactory, eventService),
    new HitAction(checkBuilderFactory, eventService),
    new FleeAction(checkBuilderFactory, mobService, locationService),
    new HamstringAction(checkBuilderFactory, eventService),

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
    new CastAction(checkBuilderFactory, getSpellTable(service)),

    // info
    new AffectsAction(),
    lookAction,
    new LoreAction(checkBuilderFactory, itemService),
    new ScoreAction(),
    new InventoryAction(itemService),
    new EquippedAction(),
    new ExitsAction(),

    // merchants/healers
    new BuyAction(checkBuilderFactory, eventService),
    new SellAction(checkBuilderFactory, eventService),
    new ListAction(checkBuilderFactory),
    new HealAction(checkBuilderFactory, locationService, getHealerSpellTable(service)),

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
