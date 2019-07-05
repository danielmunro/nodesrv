import Spell from "../../action/impl/spell"
import CrusadeEventConsumer from "../../affect/eventConsumer/crusadeEventConsumer"
import DamageSourceEventConsumer from "../../affect/eventConsumer/damageSourceEventConsumer"
import DetectTouchEventConsumer from "../../affect/eventConsumer/detectTouchEventConsumer"
import EnduranceEventConsumer from "../../affect/eventConsumer/enduranceEventConsumer"
import FlyEventConsumer from "../../affect/eventConsumer/flyEventConsumer"
import ForgetEventConsumer from "../../affect/eventConsumer/forgetEventConsumer"
import HasteEventConsumer from "../../affect/eventConsumer/hasteEventConsumer"
import HolySilenceEventConsumer from "../../affect/eventConsumer/holySilenceEventConsumer"
import OrbOfTouchEventConsumer from "../../affect/eventConsumer/orbOfTouchEventConsumer"
import ProtectionEventConsumer from "../../affect/eventConsumer/protectionEventConsumer"
import SanctuaryEventConsumer from "../../affect/eventConsumer/sanctuaryEventConsumer"
import WithstandDeathEventConsumer from "../../affect/eventConsumer/withstandDeathEventConsumer"
import Disconnected from "../../client/eventConsumer/disconnected"
import LoggedIn from "../../client/eventConsumer/loggedIn"
import LookEventConsumer from "../../client/eventConsumer/lookEventConsumer"
import Quit from "../../client/eventConsumer/quit"
import Social from "../../client/eventConsumer/social"
import GameService from "../../gameService/gameService"
import ItemCreated from "../../item/eventConsumer/itemCreated"
import ItemDestroyed from "../../item/eventConsumer/itemDestroyed"
import FlamingWeaponEffectEventConsumer from "../../item/eventConsumer/weaponEffect/flamingWeaponEffectEventConsumer"
import FrostWeaponEffectEventConsumer from "../../item/eventConsumer/weaponEffect/frostWeaponEffectEventConsumer"
import VampiricWeaponEffectEventConsumer from "../../item/eventConsumer/weaponEffect/vampiricWeaponEffectEventConsumer"
import ItemService from "../../item/service/itemService"
import WeaponEffectService from "../../item/service/weaponEffectService"
import AggressiveMobEventConsumer from "../../mob/eventConsumer/aggressiveMobEventConsumer"
import ClientCreatedEventConsumer from "../../mob/eventConsumer/clientCreatedEventConsumer"
import {default as MobClientDisconnected} from "../../mob/eventConsumer/clientDisconnectedEventConsumer"
import DamageModifierEventConsumer from "../../mob/eventConsumer/damageModifierEventConsumer"
import DeathTimerEventConsumer from "../../mob/eventConsumer/deathTimerEventConsumer"
import FightStarterEventConsumer from "../../mob/eventConsumer/fightStarterEventConsumer"
import FollowMobEventConsumer from "../../mob/eventConsumer/followMobEventConsumer"
import MobCreatedEventConsumer from "../../mob/eventConsumer/mobCreatedEventConsumer"
import MobUpdatedEventConsumer from "../../mob/eventConsumer/mobUpdatedEventConsumer"
import PetFollowsOwnerEventConsumer from "../../mob/eventConsumer/petFollowsOwnerEventConsumer"
import ScavengeEventConsumer from "../../mob/eventConsumer/scavengeEventConsumer"
import WimpyEventConsumer from "../../mob/eventConsumer/wimpyEventConsumer"
import {DamageType} from "../../mob/fight/enum/damageType"
import FightBuilder from "../../mob/fight/fightBuilder"
import DrowMageBonus from "../../mob/race/eventConsumer/drow/drowMageBonus"
import ElfForestRegenBonus from "../../mob/race/eventConsumer/elf/elfForestRegenBonus"
import ElfIronVuln from "../../mob/race/eventConsumer/elf/elfIronVuln"
import HalflingMvBonus from "../../mob/race/eventConsumer/halfling/halflingMvBonus"
import OgreBashBonus from "../../mob/race/eventConsumer/ogre/ogreBashBonus"
import OgreSizeMismatchVuln from "../../mob/race/eventConsumer/ogre/ogreSizeMismatchVuln"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import DamageTypeEventConsumer from "../../mob/skill/eventConsumer/damageTypeEventConsumer"
import DodgeEventConsumer from "../../mob/skill/eventConsumer/dodgeEventConsumer"
import ExtraAttackEventConsumer from "../../mob/skill/eventConsumer/extraAttackEventConsumer"
import FastHealingEventConsumer from "../../mob/skill/eventConsumer/fastHealingEventConsumer"
import ImproveInvokedSkillsEventConsumer from "../../mob/skill/eventConsumer/improveInvokedSkillsEventConsumer"
import ParryEventConsumer from "../../mob/skill/eventConsumer/parryEventConsumer"
import ShieldBlockEventConsumer from "../../mob/skill/eventConsumer/shieldBlockEventConsumer"
import {SkillType} from "../../mob/skill/skillType"
import MobArrives from "../../player/eventConsumer/mobArrives"
import MobLeaves from "../../player/eventConsumer/mobLeaves"
import PlayerMobDeath from "../../player/eventConsumer/playerMobDeath"
import {RequestType} from "../../request/enum/requestType"
import RoomMessageEventConsumer from "../../room/eventConsumer/roomMessageEventConsumer"
import {GameServerService} from "../../server/service/gameServerService"
import EventConsumer from "../eventConsumer"
import EventService from "../service/eventService"

export default function createEventConsumerTable(
  gameService: GameService,
  gameServer: GameServerService,
  mobService: MobService,
  itemService: ItemService,
  fightBuilder: FightBuilder,
  eventService: EventService,
  locationService: LocationService): EventConsumer[] {
  const clientService = gameServer.clientService
  const weaponEffectService = new WeaponEffectService(eventService, locationService, clientService)
  return [
    // affects
    new SanctuaryEventConsumer(),
    new CrusadeEventConsumer(),
    new ForgetEventConsumer(),
    new HasteEventConsumer(),
    new DamageSourceEventConsumer(),
    new ProtectionEventConsumer(),
    new WithstandDeathEventConsumer(),
    new HolySilenceEventConsumer(),
    new OrbOfTouchEventConsumer(),
    new DetectTouchEventConsumer(eventService),
    new EnduranceEventConsumer(),
    new FlyEventConsumer(),

    // mob
    new AggressiveMobEventConsumer(mobService, locationService, fightBuilder),
    new PetFollowsOwnerEventConsumer(locationService),
    new MobArrives(clientService),
    new MobLeaves(clientService),
    new ScavengeEventConsumer(clientService, itemService, locationService),
    new WimpyEventConsumer(locationService, gameService.getAction(RequestType.Flee)),
    new FightStarterEventConsumer(mobService, fightBuilder),
    new MobClientDisconnected(locationService),
    new MobCreatedEventConsumer(mobService, gameServer.startRoom),
    new DamageModifierEventConsumer(),
    new FollowMobEventConsumer(locationService, gameService.getMovementActions()),
    new DeathTimerEventConsumer(eventService),
    new PlayerMobDeath(locationService, gameServer.startRoom),

    // race
    new ElfIronVuln(),
    new ElfForestRegenBonus(),
    new OgreSizeMismatchVuln(),
    new OgreBashBonus(),
    new HalflingMvBonus(),
    new DrowMageBonus(
      gameService.getActions().filter(action => action instanceof Spell) as Spell[]),

    // room
    new RoomMessageEventConsumer(clientService, locationService),

    // item
    new ItemCreated(itemService),
    new ItemDestroyed(itemService),

    // weapon effects
    new FlamingWeaponEffectEventConsumer(weaponEffectService),
    new FrostWeaponEffectEventConsumer(weaponEffectService),
    new VampiricWeaponEffectEventConsumer(weaponEffectService),

    // social
    new Social(clientService),

    // skills
    new DodgeEventConsumer(gameService.getSkill(SkillType.Dodge)),
    new FastHealingEventConsumer(gameService.getSkill(SkillType.FastHealing)),
    new ExtraAttackEventConsumer(gameService.getSkill(SkillType.SecondAttack)),
    new ExtraAttackEventConsumer(gameService.getSkill(SkillType.ThirdAttack)),
    new ShieldBlockEventConsumer(gameService.getSkill(SkillType.ShieldBlock)),
    new ParryEventConsumer(gameService.getSkill(SkillType.Parry)),
    new ImproveInvokedSkillsEventConsumer(),
    new DamageTypeEventConsumer(SkillType.Bludgeon, DamageType.Bash),
    new DamageTypeEventConsumer(SkillType.Cleave, DamageType.Slash),
    new DamageTypeEventConsumer(SkillType.Gouge, DamageType.Pierce),

    // app
    new MobCreatedEventConsumer(mobService, gameServer.startRoom),
    new MobUpdatedEventConsumer(clientService),

    // client
    new Disconnected(clientService),
    new ClientCreatedEventConsumer(locationService, gameServer.startRoom),
    new LoggedIn(locationService, gameServer.startRoom, gameService.getAction(RequestType.Look)),
    new Quit(clientService, mobService),
    new LookEventConsumer(clientService, gameService.getAction(RequestType.Look)),
  ]
}
