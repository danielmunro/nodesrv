import { AffectType } from "./affectType"
import { Affect } from "./model/affect"

export function newAffect(affectType: AffectType, timeout: number): Affect {
  const affect = new Affect()
  affect.affectType = affectType
  affect.timeout = timeout

  return affect
}
