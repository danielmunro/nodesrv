import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Disposition} from "../enum/disposition"
import MobEvent from "../event/mobEvent"

export default class DeathTimerEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    if (event.mob.deathTimer) {
      event.mob.deathTimer--
      if (event.mob.deathTimer === 0) {
        event.mob.disposition = Disposition.Dead
      }
    }
    return EventResponse.none(event)
  }
}
