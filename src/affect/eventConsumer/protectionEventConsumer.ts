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
  private static isNeutral(mob: Mob) {
    return mob.alignment > ALIGNMENT_EVIL && mob.alignment < ALIGNMENT_GOOD
  }

  private static isEvil(mob: Mob) {
    return mob.alignment < ALIGNMENT_EVIL
  }

  private static isGood(mob: Mob) {
    return mob.alignment > ALIGNMENT_GOOD
  }

  public consume(event: DamageEvent): Promise<EventResponse> {
    const target = event.target
    const source = event.source as Mob
    const affect = target.affect()

    if (affect.has(AffectType.ProtectionNeutral) && ProtectionEventConsumer.isNeutral(source) ||
      affect.has(AffectType.ProtectionEvil) && ProtectionEventConsumer.isEvil(source) ||
      affect.has(AffectType.ProtectionGood) && ProtectionEventConsumer.isGood(source)) {
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
