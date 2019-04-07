import vulnerabilityModifier from "../../damage/vulnerabilityModifier"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Vulnerability} from "../../mob/enum/vulnerability"
import DamageEvent from "../../mob/event/damageEvent"

export default class DamageSourceEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    let amount = event.amount
    const target = event.target
    const damageType = event.damageType
    target.affects.forEach(affect => {
      if (affect.resist && affect.resist.isDamageTypeActive(damageType)) {
        amount = vulnerabilityModifier(Vulnerability.Resist, amount)
      } else if (affect.vulnerable && affect.vulnerable.isDamageTypeActive(damageType)) {
        amount = vulnerabilityModifier(Vulnerability.Vulnerable, amount)
      } else if (affect.immune && affect.immune.isDamageTypeActive(damageType)) {
        amount = 0
      }
    })
    if (amount !== event.amount) {
      return EventResponse.modified(new DamageEvent(
        event.target,
        amount,
        event.damageType,
        event.source))
    }
    return EventResponse.none(event)
  }
}
