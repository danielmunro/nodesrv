import Attributes from "../attributes/model/attributes"
import { AffectType } from "./affectType"
import { Affect } from "./model/affect"

export function newAffect(affectType: AffectType, timeout: number, attributes: Attributes = new Attributes()): Affect {
  const affect = new Affect()
  affect.affectType = affectType
  affect.timeout = timeout
  affect.attributes = attributes

  return affect
}
