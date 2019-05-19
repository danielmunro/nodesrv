import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {createDamageEvent} from "../../event/factory"
import {Vulnerability} from "../../mob/enum/vulnerability"
import DamageEvent from "../../mob/event/damageEvent"
import vulnerabilityModifier from "../../mob/fight/vulnerabilityModifier"

export default class DamageSourceEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    let modifier = event.modifier
    const target = event.target
    const damageType = event.damageType
    target.affects.forEach(affect => {
      if (affect.resist && affect.resist.isDamageTypeActive(damageType)) {
        modifier = vulnerabilityModifier(Vulnerability.Resist)
      } else if (affect.vulnerable && affect.vulnerable.isDamageTypeActive(damageType)) {
        modifier = vulnerabilityModifier(Vulnerability.Vulnerable)
      } else if (affect.immune && affect.immune.isDamageTypeActive(damageType)) {
        modifier = vulnerabilityModifier(Vulnerability.Invulnerable)
      }
    })
    if (modifier !== event.modifier) {
      return EventResponse.modified(createDamageEvent(
        event.target, event.amount, event.damageType, event.modifier + modifier, event.source))
    }
    return EventResponse.none(event)
  }
}
