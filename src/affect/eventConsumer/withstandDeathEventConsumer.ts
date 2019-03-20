import EventConsumer from "../../event/eventConsumer"
import {EventType} from "../../event/eventType"
import DamageEvent from "../../mob/event/damageEvent"
import EventResponse from "../../event/eventResponse"
import {AffectType} from "../affectType"

export default class WithstandDeathEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const target = event.target
    if (target.vitals.hp < event.amount && target.getAffect(AffectType.WithstandDeath)) {
      target.removeAffect(AffectType.WithstandDeath)
      return EventResponse.satisfied(new DamageEvent(
        target,
        0,
        event.damageType,
        event.source))
    }
    return EventResponse.none(event)
  }
}
