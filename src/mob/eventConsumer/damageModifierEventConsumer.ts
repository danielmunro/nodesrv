import { injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createModifiedDamageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import DamageEvent from "../event/damageEvent"
import DamageModifier from "../fight/damageModifier"
import vulnerabilityModifier from "../fight/vulnerabilityModifier"

@injectable()
export default class DamageModifierEventConsumer implements EventConsumer {
  private static getDamageModifier(event: DamageEvent) {
    return event.mob.race().damageAbsorption.find(modifier => modifier.damageType === event.damageType)
  }

  public getConsumingEventTypes(): EventType[] {
    return [EventType.DamageCalculation]
  }

  public async isEventConsumable(event: DamageEvent): Promise<boolean> {
    const damageModifier = DamageModifierEventConsumer.getDamageModifier(event)
    return !!damageModifier
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const damageModifier = DamageModifierEventConsumer.getDamageModifier(event) as DamageModifier

    return EventResponse.modified(
      createModifiedDamageEvent(event, vulnerabilityModifier(damageModifier.vulnerability)))
  }
}
