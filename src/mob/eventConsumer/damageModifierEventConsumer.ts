import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import DamageEvent from "../event/damageEvent"
import vulnerabilityModifier from "../fight/vulnerabilityModifier"

export default class DamageModifierEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const damageModifier = event.target.race().damageAbsorption.find(modifier =>
      modifier.damageType === event.damageType)

    if (!damageModifier) {
      return EventResponse.none(event)
    }

    return EventResponse.modified(
      event.createNewDamageEventAddingToModifier(
        vulnerabilityModifier(damageModifier.vulnerability)))
  }
}
