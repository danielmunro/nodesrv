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
import {GameServer} from "../server/server"
import EventConsumer from "./eventConsumer"

export default async function createEventConsumerTable(
  gameServer: GameServer,
  mobService: MobService,
  itemService: ItemService,
  fightBuilder: FightBuilder): Promise<EventConsumer[]> {
  return Promise.resolve([
    new AggressiveMob(mobService, mobService.locationService, fightBuilder),
    new PetFollowsOwner(mobService.locationService),
    new MobArrives(gameServer.clientService),
    new MobLeaves(gameServer.clientService),
    new Scavenge(gameServer.clientService, itemService, mobService.locationService),
    new Wimpy(mobService.locationService, await gameServer.service.getActionDefinition(RequestType.Flee)),
  ])
}
