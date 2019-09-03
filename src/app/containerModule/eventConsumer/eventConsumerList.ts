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
import ClientDisconnectedEventConsumer from "../../../client/eventConsumer/clientDisconnectedEventConsumer"
import ClientSessionEndedEventConsumer from "../../../client/eventConsumer/clientSessionEndedEventConsumer"
import DisconnectedEventConsumer from "../../../client/eventConsumer/disconnectedEventConsumer"
import LoggedInEventConsumer from "../../../client/eventConsumer/loggedInEventConsumer"
import LookEventConsumer from "../../../client/eventConsumer/lookEventConsumer"
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
import AggressiveMobEventConsumer from "../../../mob/eventConsumer/aggressiveMobEventConsumer"
import DamageModifierEventConsumer from "../../../mob/eventConsumer/damageModifierEventConsumer"
import DeathTimerEventConsumer from "../../../mob/eventConsumer/deathTimerEventConsumer"
import FightStarterEventConsumer from "../../../mob/eventConsumer/fightStarterEventConsumer"
import FollowMobEventConsumer from "../../../mob/eventConsumer/followMobEventConsumer"
import MobCreatedEventConsumer from "../../../mob/eventConsumer/mobCreatedEventConsumer"
import PetFollowsOwnerEventConsumer from "../../../mob/eventConsumer/petFollowsOwnerEventConsumer"
import ScavengeEventConsumer from "../../../mob/eventConsumer/scavengeEventConsumer"
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
import MobArrivesInRoomEventConsumer from "../../../player/eventConsumer/mobArrivesInRoomEventConsumer"
import MobLeavesRoomEventConsumer from "../../../player/eventConsumer/mobLeavesRoomEventConsumer"
import ResetPlayerMobOnDeathEventConsumer from "../../../player/eventConsumer/resetPlayerMobOnDeathEventConsumer"
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
  ScavengeEventConsumer,
  WimpyEventConsumer,
  FightStarterEventConsumer,
  ClientDisconnectedEventConsumer,
  MobCreatedEventConsumer,
  DamageModifierEventConsumer,
  FollowMobEventConsumer,
  DeathTimerEventConsumer,

  // player
  ResetPlayerMobOnDeathEventConsumer,
  MobArrivesInRoomEventConsumer,
  MobLeavesRoomEventConsumer,

  // race
  ElfIronVulnEventConsumer,
  ElfForestRegenBonusEventConsumer,
  OgreSizeMismatchVulnEventConsumer,
  OgreBashBonusEventConsumer,
  HalflingMvBonusEventConsumer,
  DrowMageBonusEventConsumer,

  // room
  RoomMessageEventConsumer,

  // item
  ItemCreatedEventConsumer,
  ItemDestroyedEventConsumer,

  // weapon effects
  FlamingWeaponEffectEventConsumer,
  FrostWeaponEffectEventConsumer,
  VampiricWeaponEffectEventConsumer,
  VorpalWeaponEffectEventConsumer,
  ShockingWeaponEffectEventConsumer,
  FavoredWeaponEffectEventConsumer,

  // social
  SocialEventConsumer,

  // clients
  SendMessageToMobEventConsumer,
  DisconnectedEventConsumer,
  LoggedInEventConsumer,
  ClientSessionEndedEventConsumer,
  LookEventConsumer,

  // skills
  ImproveInvokedSkillsEventConsumer,
  DodgeEventConsumer,
  FastHealingEventConsumer,
  SecondAttackEventConsumer,
  ThirdAttackEventConsumer,
  ShieldBlockEventConsumer,
  ParryEventConsumer,
  BludgeonDamageTypeEventConsumer,
  CleaveDamageTypeEventConsumer,
]
