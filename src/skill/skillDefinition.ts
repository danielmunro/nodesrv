import { Trigger } from "../trigger"
import Attempt from "./attempt"
import Outcome from "./outcome"
import { SkillType } from "./skillType"

export default class SkillDefinition {
  public readonly skillType: SkillType
  public readonly triggers: Trigger[]
  public readonly action: (attempt: Attempt) => Promise<Outcome>

  constructor(skillType: SkillType, triggers: Trigger[], action) {
    this.skillType = skillType
    this.triggers = triggers
    this.action = action
  }
}
