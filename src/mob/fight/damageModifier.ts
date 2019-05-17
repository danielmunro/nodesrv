import {Vulnerability} from "../enum/vulnerability"
import {DamageType} from "./enum/damageType"

export default class DamageModifier {
  constructor(
    public readonly damageType: DamageType,
    public readonly vulnerability: Vulnerability) {
  }
}
