import { Trigger } from "../mob/trigger"
import Attempt from "./attempt"
import Check from "./check"
import Outcome from "./outcome"
import { SkillType } from "./skillType"

export default class SkillDefinition {
  public readonly skillType: SkillType
  public readonly triggers: Trigger[]
  public readonly action: (attempt: Attempt) => Promise<Outcome>
  public readonly preconditions: (attempt: Attempt) => Promise<Check>

  constructor(skillType: SkillType, triggers: Trigger[], action, preconditions = null) {
    this.skillType = skillType
    this.triggers = triggers
    this.action = action
    this.preconditions = preconditions
  }

  public isSkillTypeMatch(skillType: SkillType) {
    return skillType === this.skillType
  }
}
