import { Trigger } from "../mob/enum/trigger"
import { AffectType } from "./enum/affectType"

export type AffectModify = (value: number) => number

export default class AffectModifier {
  constructor(
    public readonly affectType: AffectType,
    public readonly trigger: Trigger,
    public readonly modifier: AffectModify) {}
}
