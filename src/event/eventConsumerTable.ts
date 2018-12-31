import Social from "../client/eventConsumer/social"
import ItemService from "../item/itemService"
import AggressiveMob from "../mob/eventConsumer/aggressiveMob"
import PetFollowsOwner from "../mob/eventConsumer/petFollowsOwner"
import Scavenge from "../mob/eventConsumer/scavenge"
import Wimpy from "../mob/eventConsumer/wimpy"
import FightBuilder from "../mob/fight/fightBuilder"
import MobService from "../mob/mobService"
import MobArrives from "../player/eventConsumer/mobArrives"
import MobLeaves from "../player/eventConsumer/mobLeaves"
import {RequestType} from "../request/requestType"
import MobCreated from "../server/eventConsumer/mobCreated"
import {GameServer} from "../server/server"
import DodgeEventConsumer from "../skill/eventConsumer/dodgeEventConsumer"
import FastHealingEventConsumer from "../skill/eventConsumer/fastHealingEventConsumer"
import SecondAttackEventConsumer from "../skill/eventConsumer/secondAttackEventConsumer"
import {SkillType} from "../skill/skillType"
import EventConsumer from "./eventConsumer"

export default async function createEventConsumerTable(
  gameServer: GameServer,
  mobService: MobService,
  itemService: ItemService,
  fightBuilder: FightBuilder): Promise<EventConsumer[]> {
  const clientService = gameServer.clientService
  const locationService = mobService.locationService
  const gameService = gameServer.service
  return Promise.resolve([
    // mob
    new AggressiveMob(mobService, locationService, fightBuilder),
    new PetFollowsOwner(locationService),
    new MobArrives(clientService),
    new MobLeaves(clientService),
    new Scavenge(clientService, itemService, locationService),
    new Wimpy(locationService, await gameService.getActionDefinition(RequestType.Flee)),

    // social
    new Social(clientService),

    // skills
    new DodgeEventConsumer(gameService.getSkillDefinition(SkillType.Dodge)),
    new FastHealingEventConsumer(gameService.getSkillDefinition(SkillType.FastHealing)),
    new SecondAttackEventConsumer(gameService.getSkillDefinition(SkillType.SecondAttack)),

    // app
    new MobCreated(mobService, gameServer.startRoom),
  ])
}
