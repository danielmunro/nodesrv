import { injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createModifiedDamageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import DamageEvent from "../event/damageEvent"
import vulnerabilityModifier from "../fight/vulnerabilityModifier"

@injectable()
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

    return EventResponse.modified(createModifiedDamageEvent(event,
      vulnerabilityModifier(damageModifier.vulnerability)))
  }
}
