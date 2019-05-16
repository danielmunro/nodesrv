import AffectBuilder from "./affectBuilder"
import { AffectType } from "./enum/affectType"
import { Affect } from "./model/affect"

export function newAffect(
  affectType: AffectType, timeout: number = -1): Affect {
  return new AffectBuilder(affectType)
    .setTimeout(timeout)
    .build()
}
