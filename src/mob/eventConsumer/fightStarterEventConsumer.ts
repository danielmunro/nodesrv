import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobInteractionEvent} from "../../event/type/mobInteractionEvent"
import FightBuilder from "../fight/fightBuilder"
import MobService from "../service/mobService"

export default class FightStarterEventConsumer implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Attack ]
  }

  public async consume(event: MobInteractionEvent): Promise<EventResponse> {
    return this.mobService.findFightForMob(event.mob)
      .maybe(() => EventResponse.none(event))
      .or(() => {
        this.mobService.addFight(this.fightBuilder.create(event.mob, event.target))
        return EventResponse.none(event)
      })
      .get()
  }
}