import vulnerabilityModifier from "../../damage/vulnerabilityModifier"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import DamageEvent from "../event/damageEvent"
import DamageModifier from "../race/damageModifier"

export default class DamageModifierEventConsumer implements EventConsumer {
  constructor(private readonly damageModifierTable: DamageModifier[]) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const damageModifier = this.damageModifierTable.find(modifier =>
      modifier.race === event.target.race && modifier.damageType === event.damageType)

    if (!damageModifier) {
      return EventResponse.none(event)
    }

    return EventResponse.modified(
      new DamageEvent(
        event.target,
        vulnerabilityModifier(damageModifier.vulnerability, event.amount),
        event.damageType))
  }
}
