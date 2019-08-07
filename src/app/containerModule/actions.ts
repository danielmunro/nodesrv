import {ContainerModule} from "inversify"
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
import DropAction from "../../action/impl/item/dropAction"
import EatAction from "../../action/impl/item/eatAction"
import GetAction from "../../action/impl/item/getAction"
import LootAction from "../../action/impl/item/lootAction"
import PutAction from "../../action/impl/item/putAction"
import RemoveAction from "../../action/impl/item/removeAction"
import SacrificeAction from "../../action/impl/item/sacrificeAction"
import WearAction from "../../action/impl/item/wearAction"
import LockAction from "../../action/impl/manipulate/lockAction"
import UnlockAction from "../../action/impl/manipulate/unlockAction"
import BuyAction from "../../action/impl/merchant/buyAction"
import HealAction from "../../action/impl/merchant/healAction"
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
import closeMultiAction from "../../action/impl/multiAction/closeMultiAction"
import openMultiAction from "../../action/impl/multiAction/openMultiAction"
import NoopAction from "../../action/impl/noopAction"
import RoomAcceptAction from "../../action/impl/room/roomAcceptAction"
import RoomBidAction from "../../action/impl/room/roomBidAction"
import RoomBidListAction from "../../action/impl/room/roomBidListAction"
import RoomInfoAction from "../../action/impl/room/roomInfoAction"
import RoomSellAction from "../../action/impl/room/roomSellAction"
import Skill from "../../action/impl/skill"
import backstabAction from "../../action/impl/skill/assassin/backstabAction"
import envenomAction from "../../action/impl/skill/assassin/envenomAction"
import eyeGougeAction from "../../action/impl/skill/assassin/eyeGougeAction"
import garotteAction from "../../action/impl/skill/assassin/garotteAction"
import gougeAction from "../../action/impl/skill/assassin/gougeAction"
import hamstringAction from "../../action/impl/skill/assassin/hamstringAction"
import tripAction from "../../action/impl/skill/assassin/tripAction"
import bashAction from "../../action/impl/skill/brawler/bashAction"
import bludgeonAction from "../../action/impl/skill/brawler/bludgeonAction"
import cleaveAction from "../../action/impl/skill/brawler/cleaveAction"
import enhancedDamageAction from "../../action/impl/skill/brawler/enhancedDamageAction"
import secondAttackAction from "../../action/impl/skill/brawler/secondAttackAction"
import shieldBashAction from "../../action/impl/skill/brawler/shieldBashAction"
import thirdAttackAction from "../../action/impl/skill/brawler/thirdAttackAction"
import repairAction from "../../action/impl/skill/crafting/repairAction"
import sharpenAction from "../../action/impl/skill/crafting/sharpenAction"
import detectHiddenAction from "../../action/impl/skill/detection/detectHiddenAction"
import detectTouchAction from "../../action/impl/skill/detection/detectTouchAction"
import enduranceAction from "../../action/impl/skill/endurance/enduranceAction"
import fastHealingAction from "../../action/impl/skill/endurance/fastHealingAction"
import dirtKickAction from "../../action/impl/skill/evasion/dirtKickAction"
import dodgeAction from "../../action/impl/skill/evasion/dodgeAction"
import parryAction from "../../action/impl/skill/evasion/parryAction"
import shieldBlockAction from "../../action/impl/skill/evasion/shieldBlockAction"
import peekAction from "../../action/impl/skill/thief/peekAction"
import sneakAction from "../../action/impl/skill/thief/sneakAction"
import stealAction from "../../action/impl/skill/thief/stealAction"
import berserkAction from "../../action/impl/skill/warrior/berserkAction"
import disarmAction from "../../action/impl/skill/warrior/disarmAction"
import weaponAction from "../../action/impl/skill/weaponAction"
import GossipAction from "../../action/impl/social/gossipAction"
import SayAction from "../../action/impl/social/sayAction"
import TellAction from "../../action/impl/social/tellAction"
import Spell from "../../action/impl/spell"
import CcAddAction from "../../action/impl/subscription/ccAddAction"
import CcListAction from "../../action/impl/subscription/ccListAction"
import CcRemoveAction from "../../action/impl/subscription/ccRemoveAction"
import SubscribeAction from "../../action/impl/subscription/subscribeAction"
import UnsubscribeAction from "../../action/impl/subscription/unsubscribeAction"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import AbilityService from "../../check/service/abilityService"
import EventService from "../../event/service/eventService"
import StateService from "../../gameService/stateService"
import ItemService from "../../item/service/itemService"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {SkillType} from "../../mob/skill/skillType"
import getSpellTable from "../../mob/spell/spellTable"
import {Types} from "../../support/types"

const actions = [
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

  // trade
  BuyAction,
  SellAction,
  ListAction,
  HealAction,

  // mobs
  FollowAction,
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

  // subscriptions
  CcListAction,
  CcAddAction,
  CcRemoveAction,
  SubscribeAction,
  UnsubscribeAction,
  NoopAction,
]

const multiActions = [
  closeMultiAction,
  openMultiAction,
]

const skillActions = [
  backstabAction,
  bashAction,
  berserkAction,
  dirtKickAction,
  disarmAction,
  tripAction,
  envenomAction,
  sharpenAction,
  sneakAction,
  stealAction,
  shieldBashAction,
  peekAction,
  garotteAction,
  detectHiddenAction,
  detectTouchAction,
  eyeGougeAction,
  hamstringAction,
  repairAction,
  enduranceAction,
]

const skills = [
  // passive fighting
  dodgeAction,
  secondAttackAction,
  thirdAttackAction,
  enhancedDamageAction,
  fastHealingAction,
  shieldBlockAction,
  parryAction,

  // actions
  backstabAction,
  dirtKickAction,
  envenomAction,
  hamstringAction,
  sharpenAction,
  sneakAction,
  stealAction,
  peekAction,
  garotteAction,
  detectHiddenAction,
  detectTouchAction,
  eyeGougeAction,
  bashAction,
  berserkAction,
  disarmAction,
  shieldBashAction,
  tripAction,
  bludgeonAction,
  cleaveAction,
  gougeAction,
  enduranceAction,
]

const weapons = [
  SkillType.Axe,
]

export default new ContainerModule(bind => {
  actions.forEach(action => bind<Action>(Types.Actions).to(action))

  multiActions.forEach(multiAction => bind<Action>(Types.Actions).toDynamicValue(context =>
    multiAction(context.container.get<CheckBuilderFactory>(Types.CheckBuilderFactory))))

  skillActions.forEach(skillAction =>
    bind<Action>(Types.Actions).toDynamicValue(context =>
      skillAction(context.container.get<AbilityService>(Types.AbilityService))))

  skills.forEach(skill =>
    bind<Skill>(Types.Skills).toDynamicValue(context =>
      skill(context.container.get<AbilityService>(Types.AbilityService))))

  weapons.forEach(weapon =>
    bind<Skill>(Types.Skills).toDynamicValue(context =>
      weaponAction(context.container.get<AbilityService>(Types.AbilityService), weapon)))

  bind<Spell[]>(Types.Spells).toDynamicValue(context =>
    getSpellTable(
      context.container.get<MobService>(Types.MobService),
      context.container.get<EventService>(Types.EventService),
      context.container.get<ItemService>(Types.ItemService),
      context.container.get<StateService>(Types.StateService),
      context.container.get<LocationService>(Types.LocationService))).inSingletonScope()
})
