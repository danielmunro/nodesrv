import {DamageType} from "../damage/damageType"
import {Vulnerability} from "./enum/vulnerability"

export default class DamageModifier {
  constructor(
    public readonly damageType: DamageType,
    public readonly vulnerability: Vulnerability) {
  }
}
