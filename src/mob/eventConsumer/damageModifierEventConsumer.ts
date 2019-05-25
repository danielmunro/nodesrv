import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {createDamageEvent} from "../../event/factory/eventFactory"
import DamageEvent from "../event/damageEvent"
import vulnerabilityModifier from "../fight/vulnerabilityModifier"

export default class DamageModifierEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const damageModifier = event.mob.race().damageAbsorption.find(modifier =>
      modifier.damageType === event.damageType)

    if (!damageModifier) {
      return EventResponse.none(event)
    }

    return EventResponse.modified(createDamageEvent(
      event.mob, event.amount, event.damageType,
      event.modifier + vulnerabilityModifier(damageModifier.vulnerability), event.source))
  }
}
