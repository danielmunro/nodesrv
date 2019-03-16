import Attributes from "../attributes/model/attributes"
import AffectBuilder from "./affectBuilder"
import { AffectType } from "./affectType"
import { Affect } from "./model/affect"

export function newAffect(
  affectType: AffectType, timeout: number = -1, attributes: Attributes = new Attributes()): Affect {
  return new AffectBuilder(affectType)
    .setTimeout(timeout)
    .setAttributes(attributes)
    .build()
}
