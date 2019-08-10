import CastAction from "../../../action/impl/castAction"
import QuitAction from "../../../action/impl/client/quitAction"
import SitAction from "../../../action/impl/disposition/sitAction"
import SleepAction from "../../../action/impl/disposition/sleepAction"
import WakeAction from "../../../action/impl/disposition/wakeAction"
import BountyAction from "../../../action/impl/fight/bountyAction"
import ConsiderAction from "../../../action/impl/fight/considerAction"
import FleeAction from "../../../action/impl/fight/fleeAction"
import HitAction from "../../../action/impl/fight/hitAction"
import KillAction from "../../../action/impl/fight/killAction"
import LevelAction from "../../../action/impl/improve/levelAction"
import PracticeAction from "../../../action/impl/improve/practiceAction"
import TrainAction from "../../../action/impl/improve/trainAction"
import AffectsAction from "../../../action/impl/info/affectsAction"
import EquippedAction from "../../../action/impl/info/equippedAction"
import ExitsAction from "../../../action/impl/info/exitsAction"
import HelpAction from "../../../action/impl/info/helpAction"
import InventoryAction from "../../../action/impl/info/inventoryAction"
import LookAction from "../../../action/impl/info/lookAction"
import LoreAction from "../../../action/impl/info/loreAction"
import OwnedAction from "../../../action/impl/info/ownedAction"
import ScanAction from "../../../action/impl/info/scanAction"
import ScoreAction from "../../../action/impl/info/scoreAction"
import WhoAction from "../../../action/impl/info/whoAction"
import DropAction from "../../../action/impl/item/dropAction"
import EatAction from "../../../action/impl/item/eatAction"
import GetAction from "../../../action/impl/item/getAction"
import LootAction from "../../../action/impl/item/lootAction"
import PutAction from "../../../action/impl/item/putAction"
import RemoveAction from "../../../action/impl/item/removeAction"
import SacrificeAction from "../../../action/impl/item/sacrificeAction"
import WearAction from "../../../action/impl/item/wearAction"
import LockAction from "../../../action/impl/manipulate/lockAction"
import UnlockAction from "../../../action/impl/manipulate/unlockAction"
import BuyAction from "../../../action/impl/merchant/buyAction"
import HealAction from "../../../action/impl/merchant/healAction"
import ListAction from "../../../action/impl/merchant/listAction"
import SellAction from "../../../action/impl/merchant/sellAction"
import FollowAction from "../../../action/impl/mob/followAction"
import NoFollowAction from "../../../action/impl/mob/noFollowAction"
import TradeRequestAction from "../../../action/impl/mob/tradeRequestAction"
import BanAction from "../../../action/impl/moderation/banAction"
import DemoteAction from "../../../action/impl/moderation/demoteAction"
import PromoteAction from "../../../action/impl/moderation/promoteAction"
import UnbanAction from "../../../action/impl/moderation/unbanAction"
import DownAction from "../../../action/impl/move/downAction"
import EastAction from "../../../action/impl/move/eastAction"
import NorthAction from "../../../action/impl/move/northAction"
import SouthAction from "../../../action/impl/move/southAction"
import UpAction from "../../../action/impl/move/upAction"
import WestAction from "../../../action/impl/move/westAction"
import NoopAction from "../../../action/impl/noopAction"
import RoomAcceptAction from "../../../action/impl/room/roomAcceptAction"
import RoomBidAction from "../../../action/impl/room/roomBidAction"
import RoomBidListAction from "../../../action/impl/room/roomBidListAction"
import RoomGroupAction from "../../../action/impl/room/roomGroupAction"
import RoomInfoAction from "../../../action/impl/room/roomInfoAction"
import RoomJoinAction from "../../../action/impl/room/roomJoinAction"
import RoomSellAction from "../../../action/impl/room/roomSellAction"
import GossipAction from "../../../action/impl/social/gossipAction"
import SayAction from "../../../action/impl/social/sayAction"
import TellAction from "../../../action/impl/social/tellAction"
import CcAddAction from "../../../action/impl/subscription/ccAddAction"
import CcListAction from "../../../action/impl/subscription/ccListAction"
import CcRemoveAction from "../../../action/impl/subscription/ccRemoveAction"
import SubscribeAction from "../../../action/impl/subscription/subscribeAction"
import UnsubscribeAction from "../../../action/impl/subscription/unsubscribeAction"

export const actions = [
  // directions
  NorthAction,
  SouthAction,
  EastAction,
  WestAction,
  UpAction,
  DownAction,

  // items
  GetAction,
  DropAction,
  PutAction,
  WearAction,
  RemoveAction,
  EatAction,
  SacrificeAction,
  LootAction,

  // locks
  UnlockAction,
  LockAction,

  // fighting
  KillAction,
  HitAction,
  FleeAction,
  BountyAction,
  ConsiderAction,

  // casting
  CastAction,

  // info
  ScoreAction,
  ScanAction,
  AffectsAction,
  LookAction,
  LoreAction,
  InventoryAction,
  EquippedAction,
  ExitsAction,
  OwnedAction,
  HelpAction,

  // rooms
  RoomInfoAction,
  RoomSellAction,
  RoomBidAction,
  RoomBidListAction,
  RoomAcceptAction,
  RoomGroupAction,
  RoomJoinAction,

  // trade
  BuyAction,
  SellAction,
  ListAction,
  HealAction,

  // mobs
  FollowAction,
  NoFollowAction,
  LevelAction,
  TradeRequestAction,

  // social
  GossipAction,
  SayAction,
  TellAction,

  // improvement
  TrainAction,
  PracticeAction,
  RoomInfoAction,

  // admin
  BanAction,
  UnbanAction,
  PromoteAction,
  DemoteAction,

  // disposition
  WakeAction,
  SleepAction,
  SitAction,

  // client
  QuitAction,
  WhoAction,

  // subscriptions
  CcListAction,
  CcAddAction,
  CcRemoveAction,
  SubscribeAction,
  UnsubscribeAction,
  NoopAction,
]
