import AggressiveMob from "../mob/eventConsumer/aggressiveMob"
import PetFollowsOwner from "../mob/eventConsumer/petFollowsOwner"
import FightBuilder from "../mob/fight/fightBuilder"
import MobService from "../mob/mobService"

export default function createEventConsumerTable(mobService: MobService, fightBuilder: FightBuilder) {
  return [
    new AggressiveMob(mobService, mobService.locationService, fightBuilder),
    new PetFollowsOwner(mobService.locationService),
  ]
}
