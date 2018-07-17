import { Mob } from "../../mob/model/mob"
import { Trigger } from "../../mob/trigger"
import { SkillType } from "../skillType"
import { Resolution } from "./resolution"

export class Event {
  public readonly mob: Mob
  public readonly trigger: Trigger
  public skillType: SkillType
  public skillEventResolution: Resolution

  constructor(mob: Mob, trigger: Trigger) {
    this.mob = mob
    this.trigger = trigger
  }

  public wasSkillInvoked(): boolean {
    return this.skillEventResolution === Resolution.Invoked
  }

  public resolveWith(skillType: SkillType) {
    this.skillType = skillType
    this.skillEventResolution = Resolution.Invoked
  }
}
