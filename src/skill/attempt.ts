import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import AttemptContext from "./attemptContext"
import { Skill } from "./model/skill"
import Outcome from "./outcome"
import { OutcomeType } from "./outcomeType"

export default class Attempt {
  constructor(public readonly mob: Mob, public readonly skill: Skill, public readonly attemptContext: AttemptContext) {}

  public getSubjectAsMob(): Mob {
    return this.attemptContext.subject
  }

  public getSubjectAsItem(): Item {
    return this.attemptContext.subject
  }

  public createSuccessOutcome(): Outcome {
    return new Outcome(this, OutcomeType.Success)
  }

  public createCheckFailOutcome(message = null): Outcome {
    return new Outcome(this, OutcomeType.CheckFail, message)
  }

  public createFailureOutcome(): Outcome {
    return new Outcome(this, OutcomeType.Failure)
  }
}
