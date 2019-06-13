import {MobEntity} from "../entity/mobEntity"
import {DamageType} from "../fight/enum/damageType"
import MobEvent from "./mobEvent"

export default interface DamageEvent extends MobEvent {
  readonly amount: number
  readonly damageType: DamageType
  readonly modifier: number
  readonly source: MobEntity
}

export function calculateDamageFromEvent(damageEvent: DamageEvent): number {
  return Math.max(0, damageEvent.amount * Math.max(0, damageEvent.modifier))
}
