import AggressiveMob from "../mob/eventConsumer/aggressiveMob"
import PetFollowsOwner from "../mob/eventConsumer/petFollowsOwner"
import FightBuilder from "../mob/fight/fightBuilder"
import MobService from "../mob/mobService"
import MobArrives from "../player/eventConsumer/mobArrives"
import MobLeaves from "../player/eventConsumer/mobLeaves"
import {GameServer} from "../server/server"

export default function createEventConsumerTable(
  gameServer: GameServer, mobService: MobService, fightBuilder: FightBuilder) {
  return [
    new AggressiveMob(mobService, mobService.locationService, fightBuilder),
    new PetFollowsOwner(mobService.locationService),
    new MobArrives(gameServer, mobService.locationService),
    new MobLeaves(gameServer, mobService.locationService),
  ]
}
