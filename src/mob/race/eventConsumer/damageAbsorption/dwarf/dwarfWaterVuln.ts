import {DamageType} from "../../../../fight/enum/damageType"
import {RaceType} from "../../../enum/raceType"
import RaceDamageAbsorption from "../raceDamageAbsorption"

export default class DwarfWaterVuln extends RaceDamageAbsorption {
  protected race = RaceType.Dwarf
  protected damageType = DamageType.Water
  protected modifier = 0.2
}
