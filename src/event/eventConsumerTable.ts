import ClientDisconnected from "../client/eventConsumer/clientDisconnected"
import Social from "../client/eventConsumer/social"
import GameService from "../gameService/gameService"
import ItemCreated from "../item/eventConsumer/itemCreated"
import ItemDestroyed from "../item/eventConsumer/itemDestroyed"
import ItemService from "../item/itemService"
import AggressiveMob from "../mob/eventConsumer/aggressiveMob"
import {default as MobClientDisconnected} from "../mob/eventConsumer/clientDisconnected"
import FightStarter from "../mob/eventConsumer/fightStarter"
import MobCreated from "../mob/eventConsumer/mobCreated"
import PetFollowsOwner from "../mob/eventConsumer/petFollowsOwner"
import Scavenge from "../mob/eventConsumer/scavenge"
import Wimpy from "../mob/eventConsumer/wimpy"
import FightBuilder from "../mob/fight/fightBuilder"
import MobService from "../mob/mobService"
import MobArrives from "../player/eventConsumer/mobArrives"
import MobLeaves from "../player/eventConsumer/mobLeaves"
import {RequestType} from "../request/requestType"
import {GameServer} from "../server/server"
import DodgeEventConsumer from "../skill/eventConsumer/dodgeEventConsumer"
import FastHealingEventConsumer from "../skill/eventConsumer/fastHealingEventConsumer"
import SecondAttackEventConsumer from "../skill/eventConsumer/secondAttackEventConsumer"
import {SkillType} from "../skill/skillType"
import EventConsumer from "./eventConsumer"

export default async function createEventConsumerTable(
  gameService: GameService,
  gameServer: GameServer,
  mobService: MobService,
  itemService: ItemService,
  fightBuilder: FightBuilder): Promise<EventConsumer[]> {
  const clientService = gameServer.clientService
  const locationService = mobService.locationService
  return Promise.resolve([
    // mob
    new AggressiveMob(mobService, locationService, fightBuilder),
    new PetFollowsOwner(locationService),
    new MobArrives(clientService),
    new MobLeaves(clientService),
    new Scavenge(clientService, itemService, locationService),
    new Wimpy(locationService, await gameService.getActionDefinition(RequestType.Flee)),
    new FightStarter(mobService, fightBuilder),
    new MobClientDisconnected(locationService),
    new MobCreated(mobService, gameServer.startRoom),

    // item
    new ItemCreated(itemService),
    new ItemDestroyed(itemService),

    // social
    new Social(clientService),

    // skills
    new DodgeEventConsumer(gameService.getSkillDefinition(SkillType.Dodge)),
    new FastHealingEventConsumer(gameService.getSkillDefinition(SkillType.FastHealing)),
    new SecondAttackEventConsumer(gameService.getSkillDefinition(SkillType.SecondAttack)),

    // app
    new MobCreated(mobService, gameServer.startRoom),

    // client
    new ClientDisconnected(clientService),
  ])
}
