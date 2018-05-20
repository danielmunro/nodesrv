import Cleric from "./cleric"
import Mage from "./mage"
import Ranger from "./ranger"
import { SpecializationType } from "./specializationType"
import Warrior from "./warrior"

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

  throw new Error("unknown specialization")
}
