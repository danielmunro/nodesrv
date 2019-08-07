import {ContainerModule} from "inversify"
import {ConditionMessages} from "../../action/constants"
import {ActionPart} from "../../action/enum/actionPart"
import Action from "../../action/impl/action"
import CastAction from "../../action/impl/castAction"
import QuitAction from "../../action/impl/client/quitAction"
import SitAction from "../../action/impl/disposition/sitAction"
import SleepAction from "../../action/impl/disposition/sleepAction"
import WakeAction from "../../action/impl/disposition/wakeAction"
import BountyAction from "../../action/impl/fight/bountyAction"
import FleeAction from "../../action/impl/fight/fleeAction"
import HitAction from "../../action/impl/fight/hitAction"
import KillAction from "../../action/impl/fight/killAction"
import LevelAction from "../../action/impl/improve/levelAction"
import PracticeAction from "../../action/impl/improve/practiceAction"
import TrainAction from "../../action/impl/improve/trainAction"
import AffectsAction from "../../action/impl/info/affectsAction"
import EquippedAction from "../../action/impl/info/equippedAction"
import ExitsAction from "../../action/impl/info/exitsAction"
import HelpAction from "../../action/impl/info/helpAction"
import InventoryAction from "../../action/impl/info/inventoryAction"
import LookAction from "../../action/impl/info/lookAction"
import LoreAction from "../../action/impl/info/loreAction"
import OwnedAction from "../../action/impl/info/ownedAction"
import ScanAction from "../../action/impl/info/scanAction"
import ScoreAction from "../../action/impl/info/scoreAction"
import CloseItemAction from "../../action/impl/item/closeItemAction"
import DropAction from "../../action/impl/item/dropAction"
import EatAction from "../../action/impl/item/eatAction"
import GetAction from "../../action/impl/item/getAction"
import LootAction from "../../action/impl/item/lootAction"
import OpenItemAction from "../../action/impl/item/openItemAction"
import PutAction from "../../action/impl/item/putAction"
import RemoveAction from "../../action/impl/item/removeAction"
import SacrificeAction from "../../action/impl/item/sacrificeAction"
import WearAction from "../../action/impl/item/wearAction"
import CloseDoorAction from "../../action/impl/manipulate/closeDoorAction"
import LockAction from "../../action/impl/manipulate/lockAction"
import OpenDoorAction from "../../action/impl/manipulate/openDoorAction"
import UnlockAction from "../../action/impl/manipulate/unlockAction"
import BuyAction from "../../action/impl/merchant/buyAction"
import ListAction from "../../action/impl/merchant/listAction"
import SellAction from "../../action/impl/merchant/sellAction"
import FollowAction from "../../action/impl/mob/followAction"
import TradeRequestAction from "../../action/impl/mob/tradeRequestAction"
import BanAction from "../../action/impl/moderation/banAction"
import DemoteAction from "../../action/impl/moderation/demoteAction"
import PromoteAction from "../../action/impl/moderation/promoteAction"
import UnbanAction from "../../action/impl/moderation/unbanAction"
import DownAction from "../../action/impl/move/downAction"
import EastAction from "../../action/impl/move/eastAction"
import NorthAction from "../../action/impl/move/northAction"
import SouthAction from "../../action/impl/move/southAction"
import UpAction from "../../action/impl/move/upAction"
import WestAction from "../../action/impl/move/westAction"
import MultiAction from "../../action/impl/multiAction"
import RoomAcceptAction from "../../action/impl/room/roomAcceptAction"
import RoomBidAction from "../../action/impl/room/roomBidAction"
import RoomBidListAction from "../../action/impl/room/roomBidListAction"
import RoomInfoAction from "../../action/impl/room/roomInfoAction"
import RoomSellAction from "../../action/impl/room/roomSellAction"
import Skill from "../../action/impl/skill"
import GossipAction from "../../action/impl/social/gossipAction"
import SayAction from "../../action/impl/social/sayAction"
import TellAction from "../../action/impl/social/tellAction"
import Spell from "../../action/impl/spell"
import getActionTable from "../../action/table/actionTable"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import EventService from "../../event/service/eventService"
import StateService from "../../gameService/stateService"
import ItemService from "../../item/service/itemService"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {getSkillTable} from "../../mob/skill/skillTable"
import getSpellTable from "../../mob/spell/spellTable"
import PlayerService from "../../player/service/playerService"
import {RequestType} from "../../request/enum/requestType"
import {Types} from "../../support/types"

export default new ContainerModule(bind => {
  // moving
  bind<Action>(Types.Actions).to(NorthAction)
  bind<Action>(Types.Actions).to(SouthAction)
  bind<Action>(Types.Actions).to(EastAction)
  bind<Action>(Types.Actions).to(WestAction)
  bind<Action>(Types.Actions).to(UpAction)
  bind<Action>(Types.Actions).to(DownAction)

  // items
  bind<Action>(Types.Actions).to(GetAction)
  bind<Action>(Types.Actions).to(DropAction)
  bind<Action>(Types.Actions).to(PutAction)
  bind<Action>(Types.Actions).to(WearAction)
  bind<Action>(Types.Actions).to(RemoveAction)
  bind<Action>(Types.Actions).to(EatAction)
  bind<Action>(Types.Actions).to(SacrificeAction)
  bind<Action>(Types.Actions).to(LootAction)

  // locks
  bind<Action>(Types.Actions).to(UnlockAction)
  bind<Action>(Types.Actions).to(LockAction)

  // open/close
  bind<Action>(Types.Actions).toDynamicValue(context => {
    const checkBuilderFactory = context.container.get<CheckBuilderFactory>(Types.CheckBuilderFactory)
    return new MultiAction(
      RequestType.Close,
      ConditionMessages.All.Arguments.Close,
      [ ActionPart.Action, ActionPart.Target ],
      [
        new CloseItemAction(checkBuilderFactory),
        new CloseDoorAction(checkBuilderFactory),
      ])
  })
  bind<Action>(Types.Actions).toDynamicValue(context => {
    const checkBuilderFactory = context.container.get<CheckBuilderFactory>(Types.CheckBuilderFactory)
    return new MultiAction(
      RequestType.Open,
      ConditionMessages.All.Arguments.Open,
      [ ActionPart.Action, ActionPart.Target ],
      [
        new OpenItemAction(checkBuilderFactory),
        new OpenDoorAction(checkBuilderFactory),
      ])
  })

  // fighting
  bind<Action>(Types.Actions).to(KillAction)
  bind<Action>(Types.Actions).to(HitAction)
  bind<Action>(Types.Actions).to(FleeAction)
  bind<Action>(Types.Actions).to(BountyAction)

  // casting
  bind<Action>(Types.Actions).to(CastAction)

  // info
  bind<Action>(Types.Actions).to(ScoreAction)
  bind<Action>(Types.Actions).to(ScanAction)
  bind<Action>(Types.Actions).to(AffectsAction)
  bind<Action>(Types.Actions).to(LookAction)
  bind<Action>(Types.Actions).to(LoreAction)
  bind<Action>(Types.Actions).to(InventoryAction)
  bind<Action>(Types.Actions).to(EquippedAction)
  bind<Action>(Types.Actions).to(ExitsAction)
  bind<Action>(Types.Actions).to(OwnedAction)
  bind<Action>(Types.Actions).to(HelpAction)

  // rooms
  bind<Action>(Types.Actions).to(RoomInfoAction)
  bind<Action>(Types.Actions).to(RoomSellAction)
  bind<Action>(Types.Actions).to(RoomBidAction)
  bind<Action>(Types.Actions).to(RoomBidListAction)
  bind<Action>(Types.Actions).to(RoomAcceptAction)

  // merchant
  bind<Action>(Types.Actions).to(BuyAction)
  bind<Action>(Types.Actions).to(SellAction)
  bind<Action>(Types.Actions).to(ListAction)
  // bind<Action>(Types.Actions).to(HealAction)

  // mobs
  bind<Action>(Types.Actions).to(FollowAction)
  bind<Action>(Types.Actions).to(LevelAction)
  bind<Action>(Types.Actions).to(TradeRequestAction)

  // social
  bind<Action>(Types.Actions).to(GossipAction)
  bind<Action>(Types.Actions).to(SayAction)
  bind<Action>(Types.Actions).to(TellAction)

  // improvement
  bind<Action>(Types.Actions).to(TrainAction)
  bind<Action>(Types.Actions).to(PracticeAction)
  bind<Action>(Types.Actions).to(RoomInfoAction)

  // admin
  bind<Action>(Types.Actions).to(BanAction)
  bind<Action>(Types.Actions).to(UnbanAction)
  bind<Action>(Types.Actions).to(PromoteAction)
  bind<Action>(Types.Actions).to(DemoteAction)

  // disposition
  bind<Action>(Types.Actions).to(WakeAction)
  bind<Action>(Types.Actions).to(SleepAction)
  bind<Action>(Types.Actions).to(SitAction)

  // client
  bind<Action>(Types.Actions).to(QuitAction)

  bind<Action[]>(Types.ActionTable).toDynamicValue(context =>
    getActionTable(
      context.container.get<MobService>(Types.MobService),
      context.container.get<EventService>(Types.EventService),
      context.container.get<Spell[]>(Types.Spells),
      context.container.get<LocationService>(Types.LocationService),
      context.container.get<PlayerService>(Types.PlayerService))).inSingletonScope()
  bind<Skill[]>(Types.Skills).toDynamicValue(context =>
    getSkillTable(
      context.container.get<MobService>(Types.MobService),
      context.container.get<EventService>(Types.EventService))).inSingletonScope()
  bind<Spell[]>(Types.Spells).toDynamicValue(context =>
    getSpellTable(
      context.container.get<MobService>(Types.MobService),
      context.container.get<EventService>(Types.EventService),
      context.container.get<ItemService>(Types.ItemService),
      context.container.get<StateService>(Types.StateService),
      context.container.get<LocationService>(Types.LocationService))).inSingletonScope()
})
