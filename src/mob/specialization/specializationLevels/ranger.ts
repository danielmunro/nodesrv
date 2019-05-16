import {SkillType} from "../../../skill/skillType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"

export default [
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Backstab, 1, 5),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.DirtKick, 3, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Trip, 3, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Sneak, 4, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Dodge, 5, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Peek, 5, 3),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Sharpen, 8, 3),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.EyeGouge, 9, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Steal, 11, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.DetectTouch, 12, 2),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Parry, 14, 6),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Envenom, 15, 4),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.FastHealing, 16, 6),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Disarm, 21, 6),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Garotte, 23, 6),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.SecondAttack, 25, 5),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.Hamstring, 31, 8),
  new SpecializationLevel(SpecializationType.Ranger, SkillType.EnhancedDamage, 32, 5),
]
