import Event from "../../event/event"
import {DamageType} from "../fight/enum/damageType"
import {Mob} from "../model/mob"

export default interface DamageEvent extends Event {
  readonly target: Mob
  readonly amount: number
  readonly damageType: DamageType
  readonly modifier: number
  readonly source: Mob
}

export function calculateDamageFromEvent(damageEvent: DamageEvent): number {
  return Math.max(0, damageEvent.amount * damageEvent.modifier)
}
