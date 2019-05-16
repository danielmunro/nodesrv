import { SpecializationType } from "./enum/specializationType"
import Cleric from "./impl/cleric"
import Mage from "./impl/mage"
import Ranger from "./impl/ranger"
import Warrior from "./impl/warrior"

export function createSpecializationFromType(specializationType: SpecializationType) {
  if (specializationType === SpecializationType.Cleric) {
    return new Cleric()
  }

  if (specializationType === SpecializationType.Mage) {
    return new Mage()
  }

  if (specializationType === SpecializationType.Ranger) {
    return new Ranger()
  }

  if (specializationType === SpecializationType.Warrior) {
    return new Warrior()
  }

  throw new Error("unknown specializationType")
}
