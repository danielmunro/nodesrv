import { Mob } from "../../mob/model/mob"
import { Trigger } from "../../trigger"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { getSkillAction } from "../skillCollection"
import { Event } from "../trigger/event"
import { Resolution } from "../trigger/resolution"

function filterBySkillTrigger(skill: Skill, trigger: Trigger) {
  return getSkillAction(skill.skillType).triggers.some((skillTrigger) => {
    return skillTrigger === trigger
  })
}

async function attemptSkillAction(mob: Mob, target: Mob, skill: Skill): Promise<Outcome> {
  return await getSkillAction(skill.skillType).action(new Attempt(mob, target, skill))
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
    if ((await attemptSkillAction(mob, target, skill)).wasSuccessful()) {
      event.resolveWith(skill.skillType)

      return event
    }
  }
  event.skillEventResolution = Resolution.Failed

  return event
}
