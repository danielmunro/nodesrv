import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import MobEvent from "../event/mobEvent"
import FightBuilder from "../fight/fightBuilder"
import MobService from "../mobService"

export default class FightStarter implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Attack ]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    const fight = this.mobService.findFightForMob(event.mob)
    if (fight && fight.isParticipant(event.context)) {
      return EventResponse.none(event)
    }
    this.mobService.addFight(this.fightBuilder.create(event.mob, event.context))
    return EventResponse.none(event)
  }
}
