import { Trigger } from "../trigger"
import bash from "./actions/bash"
import dodge from "./actions/dodge"
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"

function createSkill(type: SkillType, triggers: Trigger[], action): SkillDefinition {
  return new SkillDefinition(type, triggers, action)
}

export const skillCollection = [
  createSkill(SkillType.Dodge, [Trigger.AttackRoundStart], dodge),
  createSkill(SkillType.Bash, [Trigger.Input], bash),
]

export function getSkillAction(skillType: SkillType) {
  return skillCollection.find((action) => action.isSkillTypeMatch(skillType))
}
