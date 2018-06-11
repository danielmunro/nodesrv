import { Mob } from "../mob/model/mob"
import { Trigger } from "../trigger"
import { SkillEventResolution } from "./skillEventResolution"
import { SkillType } from "./skillType"

export class SkillTriggerEvent {
  public readonly mob: Mob
  public readonly trigger: Trigger
  public skillType: SkillType
  public skillEventResolution: SkillEventResolution

  constructor(mob: Mob, trigger: Trigger) {
    this.mob = mob
    this.trigger = trigger
  }

  public wasSkillInvoked(): boolean {
    return this.skillEventResolution === SkillEventResolution.SKILL_INVOKED
  }
}
