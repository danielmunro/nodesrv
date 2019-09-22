import { injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EveryMessageEventConsumer from "../../event/eventConsumer/everyMessageEventConsumer"
import {createDamageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import DamageEvent from "../../mob/event/damageEvent"
import {AffectType} from "../enum/affectType"

export const ALIGNMENT_EVIL = -300
export const ALIGNMENT_GOOD = 300
const MODIFIER = -0.3

@injectable()
export default class ProtectionEventConsumer extends EveryMessageEventConsumer implements EventConsumer {
  public consume(event: DamageEvent): Promise<EventResponse> {
    const target = event.mob
    const source = event.source
    const affect = target.affect()
    const srcAlign = source.align()

    if (affect.has(AffectType.ProtectionNeutral) && srcAlign.isNeutral() ||
      affect.has(AffectType.ProtectionEvil) && srcAlign.isEvil() ||
      affect.has(AffectType.ProtectionGood) && srcAlign.isGood()) {
      return EventResponse.modified(createDamageEvent(
        event.mob, event.amount, event.damageType, event.modifier + MODIFIER, event.source))
    }

    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }
}
