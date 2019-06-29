import {SkillType} from "../../skill/skillType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"

function createSpec(skillType: SkillType, minimumLevel: number, creationPoints: number): SpecializationLevel {
  return new SpecializationLevel(SpecializationType.Warrior, skillType, minimumLevel, creationPoints)
}

export default [
  createSpec(SkillType.Bash, 1, 4),
  createSpec(SkillType.Trip, 3, 8),
  createSpec(SkillType.DirtKick, 3, 4),
  createSpec(SkillType.Berserk, 5, 5),
  createSpec(SkillType.ShieldBlock, 5, 2),
  createSpec(SkillType.FastHealing, 6, 4),
  createSpec(SkillType.SecondAttack, 7, 3),
  createSpec(SkillType.Repair, 10, 8),
  createSpec(SkillType.Disarm, 11, 4),
  createSpec(SkillType.EnhancedDamage, 12, 3),
  createSpec(SkillType.Dodge, 13, 6),
  createSpec(SkillType.Sharpen, 15, 4),
  createSpec(SkillType.ShieldBash, 18, 7),
  createSpec(SkillType.DetectHidden, 19, 6),
  createSpec(SkillType.Parry, 20, 4),
  createSpec(SkillType.Bludgeon, 22, 6),
  createSpec(SkillType.Cleave, 22, 6),
  createSpec(SkillType.Gouge, 22, 6),
  createSpec(SkillType.DetectTouch, 24, 6),
  createSpec(SkillType.ThirdAttack, 28, 4),
]
