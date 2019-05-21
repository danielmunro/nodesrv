import AffectBuilder from "./affectBuilder"
import AffectDefinition from "./affectDefinition"
import {AffectType} from "./enum/affectType"
import {StackBehavior} from "./enum/stackBehavior"
import {Affect} from "./model/affect"

export function newAffect(
  affectType: AffectType, timeout: number = -1): Affect {
  return new AffectBuilder(affectType)
    .setTimeout(timeout)
    .build()
}

export function createAffectDefinition(
  affectType: AffectType, stackBehavior: StackBehavior, stackMessage?: string): AffectDefinition {
  return {affectType, stackBehavior, stackMessage}
}
