import {AffectType} from "./affectType"
import {StackBehavior} from "./stackBehavior"

export default class AffectDefinition {
  constructor(
    public readonly affectType: AffectType,
    public readonly stackBehavior: StackBehavior,
    public readonly stackMessage: string = null) {}
}
