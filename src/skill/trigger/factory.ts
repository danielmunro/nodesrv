import { Mob } from "../../mob/model/mob"
import { Trigger } from "../../trigger"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import { OutcomeType } from "../outcomeType"
import { getSkillAction } from "../skillCollection"
import { Event } from "../trigger/event"
import { Resolution } from "../trigger/resolution"

function filterBySkillTrigger(skill: Skill, trigger: Trigger) {
  return getSkillAction(skill.skillType).triggers.some((skillTrigger) => {
    return skillTrigger === trigger
  })
}

export async function createSkillTriggerEvent(
  mob: Mob,
  skillTrigger: Trigger,
  target: Mob = null,
): Promise<Event> {
  if (target === null) {
    target = mob
  }

  const event = new Event(mob, skillTrigger)
  const skills = mob.skills.filter((skill) => filterBySkillTrigger(skill, skillTrigger))
  for (const skill of skills) {
    const skillAction = getSkillAction(skill.skillType)
    const result = await skillAction.action(new Attempt(mob, target, skill))
    if (result.outcomeType === OutcomeType.Success) {
      event.skillType = skill.skillType
      event.skillEventResolution = Resolution.Invoked

      return event
    }
  }

  return event
}
