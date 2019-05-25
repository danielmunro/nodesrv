import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {createDamageEvent} from "../../event/factory/eventFactory"
import DamageEvent from "../../mob/event/damageEvent"
import {AffectType} from "../enum/affectType"

export default class SanctuaryEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    if (!event.mob.affect().has(AffectType.Sanctuary)) {
      return EventResponse.none(event)
    }

    return EventResponse.modified(createDamageEvent(
      event.mob, event.amount, event.damageType, event.modifier - 0.5, event.source))
  }
}
