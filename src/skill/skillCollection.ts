import { Trigger } from "../trigger"
import bash from "./actions/bash"
import berserk from "./actions/berserk"
import dodge from "./actions/dodge"
import trip from "./actions/trip"
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"

function createSkill(type: SkillType, triggers: Trigger[], action): SkillDefinition {
  return new SkillDefinition(type, triggers, action)
}

export const skillCollection = [
  createSkill(SkillType.Dodge, [Trigger.AttackRoundStart], dodge),
  createSkill(SkillType.Bash, [Trigger.Input], bash),
  createSkill(SkillType.Trip, [Trigger.Input], trip),
  createSkill(SkillType.Berserk, [Trigger.Input], berserk),
]

export function getSkillAction(skillType: SkillType) {
  return skillCollection.find((action) => action.isSkillTypeMatch(skillType))
}
