import { Skill } from "./model/skill"
import { SkillType } from "./skillType"

export function newSkill(skillType: SkillType, level: number = 1) {
  const skill = new Skill()
  skill.skillType = skillType
  skill.level = level

  return skill
}
