import { Mob } from "../mob/model/mob"
import { Skill } from "./model/skill"
import AttemptContext from "./attemptContext"

export default class Attempt {
  constructor(public readonly mob: Mob, public readonly skill: Skill, public readonly attemptContext: AttemptContext) {}

  public getSubjectAsMob(): Mob {
    return this.attemptContext.subject
  }
}
