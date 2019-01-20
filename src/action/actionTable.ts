import CheckBuilderFactory from "../check/checkBuilderFactory"
import GameService from "../gameService/gameService"
import getHealerSpellTable from "../mob/healer/healerSpellTable"
import SocialService from "../social/socialService"
import getSpellTable from "../spell/spellTable"
import Action from "./action"
import AnyAction from "./impl/anyAction"
import CastAction from "./impl/castAction"
import SleepAction from "./impl/disposition/sleepAction"
import WakeAction from "./impl/disposition/wakeAction"
import FleeAction from "./impl/fight/fleeAction"
import KillAction from "./impl/fight/killAction"
import AffectsAction from "./impl/info/affectsAction"
import EquippedAction from "./impl/info/equippedAction"
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
    new FleeAction(checkBuilderFactory, mobService, locationService),

    // skills
    // definition.action(RequestType.Bash, bash, defaultSkillPrecondition),
    // definition.action(RequestType.Berserk, berserk, defaultSkillPrecondition),
    // definition.action(RequestType.Disarm, disarm, disarmPrecondition),
    // definition.action(RequestType.Envenom, envenom, envenomPrecondition),
    // definition.action(RequestType.Sneak, sneak, sneakPrecondition),
    // definition.action(RequestType.Trip, trip, fightSkillPrecondition),
    // definition.action(RequestType.Steal, steal, stealPrecondition),

    // casting
    new CastAction(checkBuilderFactory, service, getSpellTable(service)),

    // info
    new AffectsAction(),
    lookAction,
    new LoreAction(checkBuilderFactory, itemService),
    new ScoreAction(),
    new InventoryAction(itemService),
    new EquippedAction(),

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
    new AnyAction(),
    ]
}
