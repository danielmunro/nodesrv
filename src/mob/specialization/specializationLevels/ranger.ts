import {SkillType} from "../../skill/skillType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"

function createSpec(skillType: SkillType, minimumLevel: number, creationPoints: number): SpecializationLevel {
  return new SpecializationLevel(SpecializationType.Ranger, skillType, minimumLevel, creationPoints)
}

export default [
  createSpec(SkillType.Backstab, 1, 5),
  createSpec(SkillType.DirtKick, 3, 4),
  createSpec(SkillType.Trip, 3, 4),
  createSpec(SkillType.Sneak, 4, 4),
  createSpec(SkillType.Dodge, 5, 4),
  createSpec(SkillType.Peek, 5, 3),
  createSpec(SkillType.Sharpen, 8, 3),
  createSpec(SkillType.DetectHidden, 8, 5),
  createSpec(SkillType.EyeGouge, 9, 4),
  createSpec(SkillType.Repair, 10, 4),
  createSpec(SkillType.Steal, 11, 4),
  createSpec(SkillType.DetectTouch, 12, 2),
  createSpec(SkillType.Parry, 14, 6),
  createSpec(SkillType.Envenom, 15, 4),
  createSpec(SkillType.FastHealing, 16, 6),
  createSpec(SkillType.Disarm, 21, 6),
  createSpec(SkillType.Garotte, 23, 6),
  createSpec(SkillType.SecondAttack, 25, 5),
  createSpec(SkillType.Hamstring, 31, 8),
  createSpec(SkillType.EnhancedDamage, 32, 5),
]
