import {EventType} from "../../event/enum/eventType"
import {createDamageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {Vulnerability} from "../../mob/enum/vulnerability"
import DamageEvent from "../../mob/event/damageEvent"
import vulnerabilityModifier from "../../mob/fight/vulnerabilityModifier"

export default class DamageSourceEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    let modifier = event.modifier
    const target = event.mob
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
        event.mob, event.amount, event.damageType, event.modifier + modifier, event.source))
    }
    return EventResponse.none(event)
  }
}
