import {DamageType} from "../../damage/damageType"
import {Vulnerability} from "../enum/vulnerability"
import {RaceType} from "./raceType"

export default class DamageModifier {
  constructor(
    public readonly race: RaceType,
    public readonly damageType: DamageType,
    public readonly vulnerability: Vulnerability) {
  }
}
