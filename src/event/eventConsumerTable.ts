import MobArrived from "../mob/eventConsumer/mobArrived"
import MobLeft from "../mob/eventConsumer/mobLeft"
import FightBuilder from "../mob/fight/fightBuilder"
import MobService from "../mob/mobService"

export default function createEventConsumerTable(mobService: MobService, fightBuilder: FightBuilder) {
  return [
    new MobArrived(mobService, mobService.locationService, fightBuilder),
    new MobLeft(),
  ]
}
