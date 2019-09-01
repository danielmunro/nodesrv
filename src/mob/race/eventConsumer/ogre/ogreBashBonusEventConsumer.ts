import { injectable } from "inversify"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import {Equipment} from "../../../../item/enum/equipment"
import DamageEvent from "../../../event/damageEvent"
import {DamageType} from "../../../fight/enum/damageType"
import {RaceType} from "../../enum/raceType"
import RaceDamageAbsorption from "../raceDamageAbsorption"

@injectable()
export default class OgreBashBonusEventConsumer extends RaceDamageAbsorption {
  protected modifier = 0.1

  protected doesConsumerApply(event: DamageEvent): boolean {
    const weapon = event.source.equipped.getItemByEquipment(Equipment.Weapon) as ItemEntity

    return event.source.raceType === RaceType.Ogre &&
      weapon && weapon.damageType === DamageType.Bash
  }
}
