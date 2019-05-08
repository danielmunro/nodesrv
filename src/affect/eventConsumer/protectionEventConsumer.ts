import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import DamageEvent from "../../mob/event/damageEvent"
import {AffectType} from "../affectType"

export const ALIGNMENT_EVIL = -300
export const ALIGNMENT_GOOD = 300
const MODIFIER = -0.3

export default class ProtectionEventConsumer implements EventConsumer {
  public consume(event: DamageEvent): Promise<EventResponse> {
    const target = event.target
    const source = event.source
    const affect = target.affect()
    const srcAlign = source.align()

    if (affect.has(AffectType.ProtectionNeutral) && srcAlign.isNeutral() ||
      affect.has(AffectType.ProtectionEvil) && srcAlign.isEvil() ||
      affect.has(AffectType.ProtectionGood) && srcAlign.isGood()) {
      return EventResponse.modified(event.createNewDamageEventAddingToModifier(MODIFIER))
    }

    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }
}
