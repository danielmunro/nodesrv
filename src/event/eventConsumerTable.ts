import getActionCollection from "../action/actionCollection"
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

export default function createEventConsumerTable(
  gameServer: GameServer, mobService: MobService, itemService: ItemService, fightBuilder: FightBuilder) {
  const fleeDefinition = getActionCollection(gameServer.service)
    .getMatchingHandlerDefinitionForRequestType(RequestType.Flee)
  return [
    new AggressiveMob(mobService, mobService.locationService, fightBuilder),
    new PetFollowsOwner(mobService.locationService),
    new MobArrives(gameServer.clientService),
    new MobLeaves(gameServer.clientService),
    new Scavenge(gameServer.clientService, itemService, mobService.locationService),
    new Wimpy(mobService.locationService, fleeDefinition),
  ]
}
