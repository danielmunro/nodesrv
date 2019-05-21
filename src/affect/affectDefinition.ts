import {AffectType} from "./enum/affectType"
import {StackBehavior} from "./enum/stackBehavior"

export default interface AffectDefinition {
  readonly affectType: AffectType,
  readonly stackBehavior: StackBehavior,
  readonly stackMessage?: string
}
