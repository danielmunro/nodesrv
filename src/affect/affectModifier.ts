import {Trigger} from "../mob/enum/trigger"
import {AffectType} from "./enum/affectType"

export type AffectModify = (value: number) => number

export default interface AffectModifier {
  readonly affectType: AffectType
  readonly trigger: Trigger
  readonly modifier: AffectModify
}

export function createAffectModifier(
  affectType: AffectType, trigger: Trigger, modifier: AffectModify): AffectModifier {
  return {affectType, trigger, modifier}
}
