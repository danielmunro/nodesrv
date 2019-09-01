import { injectable } from "inversify"
import {Equipment} from "../../../../item/enum/equipment"
import {MaterialType} from "../../../../item/enum/materialType"
import DamageEvent from "../../../event/damageEvent"
import {DamageType} from "../../../fight/enum/damageType"
import {RaceType} from "../../enum/raceType"
import RaceDamageAbsorption from "../raceDamageAbsorption"

@injectable()
export default class ElfIronVuln extends RaceDamageAbsorption {
  private static damageTypes = [DamageType.Slash, DamageType.Bash, DamageType.Pierce]
  protected race = RaceType.Elf
  protected modifier = 0.2

  protected doesConsumerApply(event: DamageEvent): boolean {
    const weapon = event.source.getFirstEquippedItemAtPosition(Equipment.Weapon)
    return (event.mob.raceType === this.race &&
      ElfIronVuln.damageTypes.includes(event.damageType) &&
      weapon &&
      weapon.material === MaterialType.Iron) as boolean
  }
}
