import { Trigger } from "../mob/trigger"
import { AffectType } from "./affectType"

export default class AffectModifier {
  constructor(
    public readonly affectType: AffectType,
    public readonly trigger: Trigger,
    public readonly modifier) {}
}
