import {Vulnerability} from "../enum/vulnerability"
import {DamageType} from "./enum/damageType"

export default interface DamageModifier {
  readonly damageType: DamageType,
  readonly vulnerability: Vulnerability,
}

export function createDamageModifier(damageType: DamageType, vulnerability: Vulnerability): DamageModifier {
  return { damageType, vulnerability }
}
