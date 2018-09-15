import { Mob } from "../mob/model/mob"
import { Skill } from "./model/skill"

export default class Attempt {
  constructor(public readonly mob: Mob, public readonly skill: Skill, public readonly attemptContext) {}
}
