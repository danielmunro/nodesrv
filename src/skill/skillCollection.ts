import { Trigger } from "../mob/trigger"
import bashAction from "./actions/bash"
import berserkAction from "./actions/berserk"
import dodgeAction from "./actions/dodge"
import sneakAction from "./actions/sneak"
import tripAction from "./actions/trip"
import bashPrecondition from "./preconditions/bash"
import berserkPrecondition from "./preconditions/berserk"
import sneakPrecondition from "./preconditions/sneak"
import tripPrecondition from "./preconditions/trip"
import SkillDefinition from "./skillDefinition"
import { SkillType } from "./skillType"

function createSkill(type: SkillType, triggers: Trigger[], action, preconditions = null): SkillDefinition {
  return new SkillDefinition(type, triggers, action, preconditions)
}

export const skillCollection = [
  createSkill(SkillType.Dodge, [Trigger.AttackRoundStart], dodgeAction),
  createSkill(SkillType.Bash, [Trigger.Input], bashAction, bashPrecondition),
  createSkill(SkillType.Trip, [Trigger.Input], tripAction, tripPrecondition),
  createSkill(SkillType.Berserk, [Trigger.Input], berserkAction, berserkPrecondition),
  createSkill(SkillType.Sneak, [Trigger.Input], sneakAction, sneakPrecondition),
]

export function getSkillAction(skillType: SkillType) {
  return skillCollection.find((action) => action.isSkillTypeMatch(skillType))
}
