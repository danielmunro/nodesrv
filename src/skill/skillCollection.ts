import { Trigger } from "../trigger"
import dodge from "./actions/dodge"
import { SkillType } from "./skillType"

function createSkill(type: SkillType, triggers: Trigger[], action) {
  return { type, action, triggers }
}

export const skillCollection = [
  createSkill(SkillType.Dodge, [Trigger.ATTACKED_START], dodge),
]

export function getSkillAction(skillType: SkillType) {
  return skillCollection.find((action) => action.type === skillType)
}
