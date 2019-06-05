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
import ItemService from "../../item/service/itemService"
import AggressiveMob from "../../mob/eventConsumer/aggressiveMob"
import ClientCreated from "../../mob/eventConsumer/clientCreated"
import {default as MobClientDisconnected} from "../../mob/eventConsumer/clientDisconnected"
import DamageModifierEventConsumer from "../../mob/eventConsumer/damageModifierEventConsumer"
import DeathTimerEventConsumer from "../../mob/eventConsumer/deathTimerEventConsumer"
import FightStarter from "../../mob/eventConsumer/fightStarter"
import FollowMob from "../../mob/eventConsumer/followMob"
import MobCreated from "../../mob/eventConsumer/mobCreated"
import MobUpdatedEventConsumer from "../../mob/eventConsumer/mobUpdatedEventConsumer"
import PetFollowsOwner from "../../mob/eventConsumer/petFollowsOwner"
import Scavenge from "../../mob/eventConsumer/scavenge"
import Wimpy from "../../mob/eventConsumer/wimpy"
import FightBuilder from "../../mob/fight/fightBuilder"
import DrowMageBonus from "../../mob/race/eventConsumer/drow/drowMageBonus"
import ElfForestRegenBonus from "../../mob/race/eventConsumer/elf/elfForestRegenBonus"
import ElfIronVuln from "../../mob/race/eventConsumer/elf/elfIronVuln"
import HalflingMvBonus from "../../mob/race/eventConsumer/halfling/halflingMvBonus"
import OgreBashBonus from "../../mob/race/eventConsumer/ogre/ogreBashBonus"
import OgreSizeMismatchVuln from "../../mob/race/eventConsumer/ogre/ogreSizeMismatchVuln"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import MobArrives from "../../player/eventConsumer/mobArrives"
import MobLeaves from "../../player/eventConsumer/mobLeaves"
import {RequestType} from "../../request/enum/requestType"
import RoomMessageEventConsumer from "../../room/eventConsumer/roomMessageEventConsumer"
import {GameServerService} from "../../server/service/gameServerService"
import DodgeEventConsumer from "../../skill/eventConsumer/dodgeEventConsumer"
import ExtraAttackEventConsumer from "../../skill/eventConsumer/extraAttackEventConsumer"
import FastHealingEventConsumer from "../../skill/eventConsumer/fastHealingEventConsumer"
import ImproveInvokedSkillsEventConsumer from "../../skill/eventConsumer/improveInvokedSkillsEventConsumer"
import ParryEventConsumer from "../../skill/eventConsumer/parryEventConsumer"
import ShieldBlockEventConsumer from "../../skill/eventConsumer/shieldBlockEventConsumer"
import {SkillType} from "../../skill/skillType"
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
    new AggressiveMob(mobService, locationService, fightBuilder),
    new PetFollowsOwner(locationService),
    new MobArrives(clientService),
    new MobLeaves(clientService),
    new Scavenge(clientService, itemService, locationService),
    new Wimpy(locationService, gameService.getAction(RequestType.Flee)),
    new FightStarter(mobService, fightBuilder),
    new MobClientDisconnected(locationService),
    new MobCreated(mobService, gameServer.startRoom),
    new DamageModifierEventConsumer(),
    new FollowMob(locationService, gameService.getMovementActions()),
    new DeathTimerEventConsumer(eventService),

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

    // app
    new MobCreated(mobService, gameServer.startRoom),
    new MobUpdatedEventConsumer(clientService),

    // client
    new Disconnected(clientService),
    new ClientCreated(locationService, gameServer.startRoom),
    new LoggedIn(locationService, gameServer.startRoom, gameService.getAction(RequestType.Look)),
    new Quit(clientService),
    new LookEventConsumer(clientService, gameService.getAction(RequestType.Look)),
  ]
}
