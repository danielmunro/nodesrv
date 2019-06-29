import { SkillEntity } from "./entity/skillEntity"
import { SkillType } from "./skillType"

export function newSkill(skillType: SkillType, level: number = 1, levelObtained: number = 1) {
  const skill = new SkillEntity()
  skill.skillType = skillType
  skill.level = level
  skill.levelObtained = levelObtained

  return skill
}
