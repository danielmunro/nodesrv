import { Trigger } from "../mob/enum/trigger"
import { AffectType } from "./enum/affectType"
import { modifierTable } from "./modifierTable"

export function applyAffectModifier(affects: AffectType[], trigger: Trigger, value: number): number {
  modifierTable
    .filter(m => m.trigger === trigger && affects.indexOf(m.affectType) > -1)
    .forEach(m => {
      value = m.modifier(value)
    })

  return value
}
