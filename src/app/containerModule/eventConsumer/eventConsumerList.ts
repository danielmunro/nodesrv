import CrusadeEventConsumer from "../../../affect/eventConsumer/crusadeEventConsumer"
import DamageSourceEventConsumer from "../../../affect/eventConsumer/damageSourceEventConsumer"
import DetectTouchEventConsumer from "../../../affect/eventConsumer/detectTouchEventConsumer"
import EnduranceEventConsumer from "../../../affect/eventConsumer/enduranceEventConsumer"
import FlyEventConsumer from "../../../affect/eventConsumer/flyEventConsumer"
import ForgetEventConsumer from "../../../affect/eventConsumer/forgetEventConsumer"
import HasteEventConsumer from "../../../affect/eventConsumer/hasteEventConsumer"
import HolySilenceEventConsumer from "../../../affect/eventConsumer/holySilenceEventConsumer"
import OrbOfTouchEventConsumer from "../../../affect/eventConsumer/orbOfTouchEventConsumer"
import ProtectionEventConsumer from "../../../affect/eventConsumer/protectionEventConsumer"
import SanctuaryEventConsumer from "../../../affect/eventConsumer/sanctuaryEventConsumer"
import WithstandDeathEventConsumer from "../../../affect/eventConsumer/withstandDeathEventConsumer"
/*tslint:disable*/
import AutoLookWhenPlayerMobMovesEventConsumer from "../../../client/eventConsumer/autoLookWhenPlayerMobMovesEventConsumer"
import ClientDisconnectRemoveClientEventConsumer from "../../../client/eventConsumer/clientDisconnectRemoveClientEventConsumer"
import ClientDisconnectRemoveMobEventConsumer from "../../../client/eventConsumer/clientDisconnectRemoveMobEventConsumer"
/*tslint:enable*/
import LoggedInEventConsumer from "../../../client/eventConsumer/loggedInEventConsumer"
import SendMessageToMobEventConsumer from "../../../client/eventConsumer/sendMessageToMobEventConsumer"
import SocialEventConsumer from "../../../client/eventConsumer/socialEventConsumer"
import ItemCreatedEventConsumer from "../../../item/eventConsumer/itemCreatedEventConsumer"
import ItemDestroyedEventConsumer from "../../../item/eventConsumer/itemDestroyedEventConsumer"
import FavoredWeaponEffectEventConsumer from "../../../item/eventConsumer/weaponEffect/favoredWeaponEffectEventConsumer"
import FlamingWeaponEffectEventConsumer from "../../../item/eventConsumer/weaponEffect/flamingWeaponEffectEventConsumer"
import FrostWeaponEffectEventConsumer from "../../../item/eventConsumer/weaponEffect/frostWeaponEffectEventConsumer"
/* tslint:disable */
import ShockingWeaponEffectEventConsumer from "../../../item/eventConsumer/weaponEffect/shockingWeaponEffectEventConsumer"
import VampiricWeaponEffectEventConsumer from "../../../item/eventConsumer/weaponEffect/vampiricWeaponEffectEventConsumer"
/* tslint:enable */
import VorpalWeaponEffectEventConsumer from "../../../item/eventConsumer/weaponEffect/vorpalWeaponEffectEventConsumer"
import AddCorpseToRoomOnDeathEventConsumer from "../../../mob/eventConsumer/addCorpseToRoomOnDeathEventConsumer"
import AggressiveMobEventConsumer from "../../../mob/eventConsumer/aggressiveMobEventConsumer"
import DamageModifierEventConsumer from "../../../mob/eventConsumer/damageModifierEventConsumer"
import DeathTimerEventConsumer from "../../../mob/eventConsumer/deathTimerEventConsumer"
import FightStarterEventConsumer from "../../../mob/eventConsumer/fightStarterEventConsumer"
import FollowMobEventConsumer from "../../../mob/eventConsumer/followMobEventConsumer"
import MobCreatedEventConsumer from "../../../mob/eventConsumer/mobCreatedEventConsumer"
import MobScavengesRoomEventConsumer from "../../../mob/eventConsumer/mobScavengesRoomEventConsumer"
import PetFollowsOwnerEventConsumer from "../../../mob/eventConsumer/petFollowsOwnerEventConsumer"
import WimpyEventConsumer from "../../../mob/eventConsumer/wimpyEventConsumer"
import DrowMageBonusEventConsumer from "../../../mob/race/eventConsumer/drow/drowMageBonusEventConsumer"
import ElfForestRegenBonusEventConsumer from "../../../mob/race/eventConsumer/elf/elfForestRegenBonusEventConsumer"
import ElfIronVulnEventConsumer from "../../../mob/race/eventConsumer/elf/elfIronVulnEventConsumer"
import HalflingMvBonusEventConsumer from "../../../mob/race/eventConsumer/halfling/halflingMvBonusEventConsumer"
import OgreBashBonusEventConsumer from "../../../mob/race/eventConsumer/ogre/ogreBashBonusEventConsumer"
import OgreSizeMismatchVulnEventConsumer from "../../../mob/race/eventConsumer/ogre/ogreSizeMismatchVulnEventConsumer"
/*tslint:disable*/
import BludgeonDamageTypeEventConsumer from "../../../mob/skill/eventConsumer/damageType/bludgeonDamageTypeEventConsumer"
/*tslint:enable*/
import CleaveDamageTypeEventConsumer from "../../../mob/skill/eventConsumer/damageType/cleaveDamageTypeEventConsumer"
import DodgeEventConsumer from "../../../mob/skill/eventConsumer/dodgeEventConsumer"
import SecondAttackEventConsumer from "../../../mob/skill/eventConsumer/extraAttack/secondAttackEventConsumer"
import ThirdAttackEventConsumer from "../../../mob/skill/eventConsumer/extraAttack/thirdAttackEventConsumer"
import FastHealingEventConsumer from "../../../mob/skill/eventConsumer/fastHealingEventConsumer"
import ImproveInvokedSkillsEventConsumer from "../../../mob/skill/eventConsumer/improveInvokedSkillsEventConsumer"
import ParryEventConsumer from "../../../mob/skill/eventConsumer/parryEventConsumer"
import ShieldBlockEventConsumer from "../../../mob/skill/eventConsumer/shieldBlockEventConsumer"
import AddExperienceFromKillEventConsumer from "../../../player/eventConsumer/addExperienceFromKillEventConsumer"
import AutoLootCorpseEventConsumer from "../../../player/eventConsumer/autoLootCorpseEventConsumer"
import AutoSacCorpseEventConsumer from "../../../player/eventConsumer/autoSacCorpseEventConsumer"
import CollectBountyOnKillEventConsumer from "../../../player/eventConsumer/collectBountyOnKillEventConsumer"
import FatalityMessagesEventConsumer from "../../../player/eventConsumer/fatalityMessagesEventConsumer"
import IncrementDeathCountsEventConsumer from "../../../player/eventConsumer/incrementDeathCountsEventConsumer"
import MobArrivesInRoomEventConsumer from "../../../player/eventConsumer/mobArrivesInRoomEventConsumer"
import MobLeavesRoomEventConsumer from "../../../player/eventConsumer/mobLeavesRoomEventConsumer"
import ResetPlayerMobOnDeathEventConsumer from "../../../player/eventConsumer/resetPlayerMobOnDeathEventConsumer"
import SaveEventConsumer from "../../../player/eventConsumer/saveEventConsumer"
import RoomMessageEventConsumer from "../../../room/eventConsumer/roomMessageEventConsumer"

export default [
  // affects
  SanctuaryEventConsumer,
  CrusadeEventConsumer,
  ForgetEventConsumer,
  HasteEventConsumer,
  DamageSourceEventConsumer,
  ProtectionEventConsumer,
  WithstandDeathEventConsumer,
  DetectTouchEventConsumer,
  HolySilenceEventConsumer,
  OrbOfTouchEventConsumer,
  EnduranceEventConsumer,
  FlyEventConsumer,

  // mob actions
  AggressiveMobEventConsumer,
  PetFollowsOwnerEventConsumer,
  MobScavengesRoomEventConsumer,
  WimpyEventConsumer,
  FightStarterEventConsumer,
  MobCreatedEventConsumer,
  DamageModifierEventConsumer,
  FollowMobEventConsumer,
  DeathTimerEventConsumer,
  AddCorpseToRoomOnDeathEventConsumer,
  FatalityMessagesEventConsumer,
  ResetPlayerMobOnDeathEventConsumer,

  // player
  MobArrivesInRoomEventConsumer,
  MobLeavesRoomEventConsumer,
  RoomMessageEventConsumer,
  SendMessageToMobEventConsumer,
  ClientDisconnectRemoveMobEventConsumer,
  ClientDisconnectRemoveClientEventConsumer,
  LoggedInEventConsumer,
  AutoLookWhenPlayerMobMovesEventConsumer,
  SocialEventConsumer,
  CollectBountyOnKillEventConsumer,
  AddExperienceFromKillEventConsumer,
  ImproveInvokedSkillsEventConsumer,
  IncrementDeathCountsEventConsumer,
  AutoLootCorpseEventConsumer,
  AutoSacCorpseEventConsumer,
  SaveEventConsumer,

  // race
  ElfIronVulnEventConsumer,
  ElfForestRegenBonusEventConsumer,
  OgreSizeMismatchVulnEventConsumer,
  OgreBashBonusEventConsumer,
  HalflingMvBonusEventConsumer,
  DrowMageBonusEventConsumer,

  // item
  ItemDestroyedEventConsumer,
  ItemCreatedEventConsumer,

  // weapon effects
  FlamingWeaponEffectEventConsumer,
  FrostWeaponEffectEventConsumer,
  VampiricWeaponEffectEventConsumer,
  VorpalWeaponEffectEventConsumer,
  ShockingWeaponEffectEventConsumer,
  FavoredWeaponEffectEventConsumer,

  // skills
  DodgeEventConsumer,
  FastHealingEventConsumer,
  SecondAttackEventConsumer,
  ThirdAttackEventConsumer,
  ShieldBlockEventConsumer,
  ParryEventConsumer,
  BludgeonDamageTypeEventConsumer,
  CleaveDamageTypeEventConsumer,
]
