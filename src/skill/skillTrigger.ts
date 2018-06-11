import { Mob } from "../mob/model/mob"
import { Trigger } from "../trigger"
import Attempt from "./attempt"
import { Skill } from "./model/skill"
import { OutcomeType } from "./outcomeType"
import { getSkillAction } from "./skillCollection"
import { SkillEventResolution } from "./skillEventResolution"
import { SkillTriggerEvent } from "./skillTriggerEvent"

function filterBySkillTrigger(skill: Skill, trigger: Trigger) {
  return getSkillAction(skill.skillType).triggers.some((skillTrigger) => {
    return skillTrigger === trigger
  })
}

export async function createSkillTriggerEvent(
  mob: Mob, skillTrigger: Trigger, target: Mob = null): Promise<SkillTriggerEvent> {
  if (target === null) {
    target = mob
  }

  const event = new SkillTriggerEvent(mob, skillTrigger)
  const skills = mob.skills.filter((skill) => filterBySkillTrigger(skill, skillTrigger))
  for (const skill of skills) {
    const skillAction = getSkillAction(skill.skillType)
    const result = await skillAction.action(new Attempt(mob, target, skill))
    if (result.outcomeType === OutcomeType.Success) {
      event.skillType = skill.skillType
      event.skillEventResolution = SkillEventResolution.SKILL_INVOKED

      return event
    }
  }

  return event
}
