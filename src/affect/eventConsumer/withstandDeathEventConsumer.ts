import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import DamageEvent from "../../mob/event/damageEvent"
import {AffectType} from "../enum/affectType"

export default class WithstandDeathEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const target = event.target
    if (target.vitals.hp < event.amount && target.affect().has(AffectType.WithstandDeath)) {
      target.affect().remove(AffectType.WithstandDeath)
      return EventResponse.satisfied(event.createNewDamageEventReplacingModifier(0))
    }
    return EventResponse.none(event)
  }
}
