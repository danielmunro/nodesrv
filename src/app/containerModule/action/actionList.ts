import CastAction from "../../../action/impl/castAction"
import SitAction from "../../../action/impl/disposition/sitAction"
import SleepAction from "../../../action/impl/disposition/sleepAction"
import WakeAction from "../../../action/impl/disposition/wakeAction"
import BountyAction from "../../../action/impl/fight/bountyAction"
import ConsiderAction from "../../../action/impl/fight/considerAction"
import FleeAction from "../../../action/impl/fight/fleeAction"
import HitAction from "../../../action/impl/fight/hitAction"
import KillAction from "../../../action/impl/fight/killAction"
import WimpyAction from "../../../action/impl/fight/wimpyAction"
import LevelAction from "../../../action/impl/improve/levelAction"
import PracticeAction from "../../../action/impl/improve/practiceAction"
import TrainAction from "../../../action/impl/improve/trainAction"
import AffectsAction from "../../../action/impl/info/affectsAction"
import AttributesAction from "../../../action/impl/info/attributesAction"
import EquippedAction from "../../../action/impl/info/equippedAction"
import ExitsAction from "../../../action/impl/info/exitsAction"
import HelpAction from "../../../action/impl/info/helpAction"
import InventoryAction from "../../../action/impl/info/inventoryAction"
import LookAction from "../../../action/impl/info/lookAction"
import LoreAction from "../../../action/impl/info/loreAction"
import OwnedAction from "../../../action/impl/info/ownedAction"
import ScanAction from "../../../action/impl/info/scanAction"
import ScoreAction from "../../../action/impl/info/scoreAction"
import TimeAction from "../../../action/impl/info/timeAction"
import WeatherAction from "../../../action/impl/info/weatherAction"
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
import GroupAction from "../../../action/impl/mob/groupAction"
import NoFollowAction from "../../../action/impl/mob/noFollowAction"
import TradeRequestAction from "../../../action/impl/mob/tradeRequestAction"
import DownAction from "../../../action/impl/move/downAction"
import EastAction from "../../../action/impl/move/eastAction"
import NorthAction from "../../../action/impl/move/northAction"
import SouthAction from "../../../action/impl/move/southAction"
import UpAction from "../../../action/impl/move/upAction"
import WestAction from "../../../action/impl/move/westAction"
import NoopAction from "../../../action/impl/noopAction"
import AfkAction from "../../../action/impl/player/afkAction"
import AliasAddAction from "../../../action/impl/player/alias/aliasAddAction"
import AliasListAction from "../../../action/impl/player/alias/aliasListAction"
import AliasRemoveAction from "../../../action/impl/player/alias/aliasRemoveAction"
import AliasResetAction from "../../../action/impl/player/alias/aliasResetAction"
import BanAction from "../../../action/impl/player/moderation/banAction"
import DemoteAction from "../../../action/impl/player/moderation/demoteAction"
import PromoteAction from "../../../action/impl/player/moderation/promoteAction"
import UnbanAction from "../../../action/impl/player/moderation/unbanAction"
import PasswordAction from "../../../action/impl/player/passwordAction"
import QuitAction from "../../../action/impl/player/quitAction"
import GossipAction from "../../../action/impl/player/social/gossipAction"
import GroupTellAction from "../../../action/impl/player/social/groupTellAction"
import ReplyAction from "../../../action/impl/player/social/replyAction"
import SayAction from "../../../action/impl/player/social/sayAction"
import TellAction from "../../../action/impl/player/social/tellAction"
import CcAddAction from "../../../action/impl/player/subscription/ccAddAction"
import CcListAction from "../../../action/impl/player/subscription/ccListAction"
import CcRemoveAction from "../../../action/impl/player/subscription/ccRemoveAction"
import SubscribeAction from "../../../action/impl/player/subscription/subscribeAction"
import UnsubscribeAction from "../../../action/impl/player/subscription/unsubscribeAction"
import RoomAcceptAction from "../../../action/impl/room/roomAcceptAction"
import RoomBidAction from "../../../action/impl/room/roomBidAction"
import RoomBidListAction from "../../../action/impl/room/roomBidListAction"
import RoomGroupAction from "../../../action/impl/room/roomGroupAction"
import RoomInfoAction from "../../../action/impl/room/roomInfoAction"
import RoomJoinAction from "../../../action/impl/room/roomJoinAction"
import RoomSellAction from "../../../action/impl/room/roomSellAction"

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
  WimpyAction,

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
  WeatherAction,
  TimeAction,
  AttributesAction,

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
  GroupAction,
  GroupTellAction,

  // social
  GossipAction,
  SayAction,
  TellAction,
  ReplyAction,

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

  // player
  QuitAction,
  WhoAction,
  AfkAction,
  AliasAddAction,
  AliasListAction,
  AliasRemoveAction,
  AliasResetAction,
  PasswordAction,

  // subscriptions
  CcListAction,
  CcAddAction,
  CcRemoveAction,
  SubscribeAction,
  UnsubscribeAction,
  NoopAction,
]
