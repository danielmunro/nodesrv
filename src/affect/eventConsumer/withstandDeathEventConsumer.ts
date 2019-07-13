import {EventType} from "../../event/enum/eventType"
import {createDamageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import DamageEvent from "../../mob/event/damageEvent"
import {AffectType} from "../enum/affectType"

export default class WithstandDeathEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const target = event.mob
    if (target.hp < event.amount && target.affect().has(AffectType.WithstandDeath)) {
      target.affect().remove(AffectType.WithstandDeath)
      return EventResponse.satisfied(
        createDamageEvent(event.mob, event.amount, event.damageType, 0, event.source))
    }
    return EventResponse.none(event)
  }
}
