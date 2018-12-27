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
import {GameServer} from "../server/server"
import EventConsumer from "./eventConsumer"

export default async function createEventConsumerTable(
  gameServer: GameServer,
  mobService: MobService,
  itemService: ItemService,
  fightBuilder: FightBuilder): Promise<EventConsumer[]> {
  const clientService = gameServer.clientService
  const locationService = mobService.locationService
  const fleeActionDefinition = await gameServer.service.getActionDefinition(RequestType.Flee)
  return Promise.resolve([
    new AggressiveMob(mobService, locationService, fightBuilder),
    new PetFollowsOwner(locationService),
    new MobArrives(clientService),
    new MobLeaves(clientService),
    new Scavenge(clientService, itemService, locationService),
    new Wimpy(locationService, fleeActionDefinition),
    new Social(clientService),
  ])
}
