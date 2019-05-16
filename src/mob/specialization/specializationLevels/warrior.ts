import {SkillType} from "../../../skill/skillType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"

export default [
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Bash, 1, 4),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Trip, 3, 8),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.DirtKick, 3, 4),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Berserk, 5, 5),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.ShieldBlock, 5, 2),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.FastHealing, 6, 4),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.SecondAttack, 7, 3),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Disarm, 11, 4),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.EnhancedDamage, 12, 3),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Dodge, 13, 6),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Sharpen, 15, 4),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.ShieldBash, 18, 7),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.Parry, 20, 4),
  new SpecializationLevel(SpecializationType.Warrior, SkillType.ThirdAttack, 28, 4),
]
