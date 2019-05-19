import {EventType} from "../../event/enum/eventType"
import {MobInteractionEvent} from "../../event/event"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import FightBuilder from "../fight/fightBuilder"
import MobService from "../service/mobService"

export default class FightStarter implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Attack ]
  }

  public async consume(event: MobInteractionEvent): Promise<EventResponse> {
    const fight = this.mobService.findFightForMob(event.mob)
    if (fight && fight.isParticipant(event.target)) {
      return EventResponse.none(event)
    }
    this.mobService.addFight(this.fightBuilder.create(event.mob, event.target))
    return EventResponse.none(event)
  }
}
