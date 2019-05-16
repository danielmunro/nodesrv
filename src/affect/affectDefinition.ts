import {AffectType} from "./enum/affectType"
import {StackBehavior} from "./enum/stackBehavior"

export default class AffectDefinition {
  constructor(
    public readonly affectType: AffectType,
    public readonly stackBehavior: StackBehavior,
    public readonly stackMessage?: string) {}
}
