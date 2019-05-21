import {Trigger} from "../../mob/enum/trigger"
import AffectModifier, {AffectModify} from "../affectModifier"
import {AffectType} from "../enum/affectType"

export function createAffectModifier(
  affectType: AffectType, trigger: Trigger, modifier: AffectModify): AffectModifier {
  return {affectType, trigger, modifier}
}
