import { injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createDamageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import DamageEvent from "../../mob/event/damageEvent"
import {AffectType} from "../enum/affectType"

@injectable()
export default class SanctuaryEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public async isEventConsumable(event: DamageEvent): Promise<boolean> {
    return event.mob.affect().has(AffectType.Sanctuary)
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    return EventResponse.modified(createDamageEvent(
      event.mob, event.amount, event.damageType, event.modifier - 0.5, event.source))
  }
}
