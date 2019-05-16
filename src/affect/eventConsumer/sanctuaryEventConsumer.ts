import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import DamageEvent from "../../mob/event/damageEvent"
import {AffectType} from "../enum/affectType"

export default class SanctuaryEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    if (!event.target.affect().has(AffectType.Sanctuary)) {
      return EventResponse.none(event)
    }

    return EventResponse.modified(event.createNewDamageEventAddingToModifier(-0.5))
  }
}
