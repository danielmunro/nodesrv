import {DamageType} from "../../damage/damageType"
import {Vulnerability} from "../enum/vulnerability"
import {Race} from "./race"

export default class DamageModifier {
  constructor(
    public readonly race: Race,
    public readonly damageType: DamageType,
    public readonly vulnerability: Vulnerability) {
  }
}
