import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import DamageEvent from "../../mob/event/damageEvent"
import {Mob} from "../../mob/model/mob"
import {AffectType} from "../affectType"

export const ALIGNMENT_EVIL = -300
export const ALIGNMENT_GOOD = 300
const MODIFIER = 0.8

export default class ProtectionEventConsumer implements EventConsumer {
  public consume(event: DamageEvent): Promise<EventResponse> {
    const target = event.target
    const source = event.source as Mob
    const affect = target.affect()
    const srcAlign = source.align()

    if (affect.has(AffectType.ProtectionNeutral) && srcAlign.isNeutral() ||
      affect.has(AffectType.ProtectionEvil) && srcAlign.isEvil() ||
      affect.has(AffectType.ProtectionGood) && srcAlign.isGood()) {
      return EventResponse.modified(
        new DamageEvent(
          target,
          event.amount * MODIFIER,
          event.damageType,
          source))
    }

    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }
}
