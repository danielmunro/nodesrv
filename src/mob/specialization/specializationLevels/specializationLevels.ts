import {SkillType} from "../../skill/skillType"
import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"
import cleric from "./cleric"
import mage from "./mage"
import ranger from "./ranger"
import warrior from "./warrior"

export const defaultSpecializationLevels = [
  // warrior
  ...warrior,

  // thief
  ...ranger,

  // cleric
  ...cleric,

  // mage
  ...mage,

  // weapon grants
  new SpecializationLevel(SpecializationType.Any, SkillType.Sword, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Mace, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Wand, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Dagger, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Stave, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Whip, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Spear, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Axe, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Flail, 1, 8),
  new SpecializationLevel(SpecializationType.Any, SkillType.Polearm, 1, 8),
]

export function getSpecializationLevel(specializationType: SpecializationType, abilityType: SkillType | SpellType) {
  return defaultSpecializationLevels.find(specializationLevel =>
    specializationLevel.specialization === specializationType &&
    specializationLevel.abilityType === abilityType)
  || new SpecializationLevel(SpecializationType.Noop, abilityType, -1)
}
