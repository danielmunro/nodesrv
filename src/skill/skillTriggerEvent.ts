import { Mob } from "../mob/model/mob"
import { Trigger } from "../trigger"
import { Skill } from "./model/skill"
import { SkillEventResolution } from "./skillTrigger"

export class SkillTriggerEvent {
  public readonly mob: Mob
  public readonly skill: Skill
  public readonly trigger: Trigger
  public skillEventResolution: SkillEventResolution

  constructor(mob: Mob, trigger: Trigger) {
    this.mob = mob
    this.trigger = trigger
  }

  public wasSkillInvoked(): boolean {
    return this.skillEventResolution === SkillEventResolution.SKILL_INVOKED
  }
}
