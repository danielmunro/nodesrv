import {Equipment} from "../../../../item/enum/equipment"
import Weapon from "../../../../item/model/weapon"
import DamageEvent from "../../../event/damageEvent"
import {DamageType} from "../../../fight/enum/damageType"
import {RaceType} from "../../enum/raceType"
import RaceDamageAbsorption from "../raceDamageAbsorption"

export default class OgreBashBonus extends RaceDamageAbsorption {
  protected modifier = 0.1

  protected doesConsumerApply(event: DamageEvent): boolean {
    const weapon = event.source.equipped.getItemByEquipment(Equipment.Weapon) as Weapon

    return event.source.raceType === RaceType.Ogre &&
      weapon && weapon.damageType === DamageType.Bash
  }
}
