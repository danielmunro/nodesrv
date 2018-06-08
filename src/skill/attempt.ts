import { Mob } from "../mob/model/mob"
import { Skill } from "./model/skill"

export default class Attempt {
  public readonly mob: Mob
  public readonly target: Mob
  public readonly skill: Skill
  public delay: number

  constructor(mob, target, skill) {
    this.mob = mob
    this.target = target
    this.skill = skill
  }
}
