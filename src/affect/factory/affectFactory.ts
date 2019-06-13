import AffectDefinition from "../affectDefinition"
import AffectBuilder from "../builder/affectBuilder"
import {AffectEntity} from "../entity/affectEntity"
import {AffectType} from "../enum/affectType"
import {StackBehavior} from "../enum/stackBehavior"

export function newAffect(
  affectType: AffectType, timeout: number = -1): AffectEntity {
  return new AffectBuilder(affectType)
    .setTimeout(timeout)
    .build()
}

export function createAffectDefinition(
  affectType: AffectType, stackBehavior: StackBehavior, stackMessage?: string): AffectDefinition {
  return { affectType, stackBehavior, stackMessage }
}
