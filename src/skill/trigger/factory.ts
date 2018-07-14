import { Mob } from "../../mob/model/mob"
import { Trigger } from "../../trigger"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { getSkillAction } from "../skillCollection"
import { Event } from "./event"
import { Resolution } from "./resolution"

function filterBySkillTrigger(skill: Skill, trigger: Trigger) {
  return getSkillAction(skill.skillType).triggers.some((skillTrigger) => {
    return skillTrigger === trigger
  })
}

function getSkillsByTrigger(mob: Mob, trigger: Trigger) {
  return mob.skills.filter((skill) => filterBySkillTrigger(skill, trigger))
}

async function attemptSkillAction(mob: Mob, target: Mob, skill: Skill): Promise<Outcome> {
  return await getSkillAction(skill.skillType).action(new Attempt(mob, target, skill))
}

export async function createSkillTriggerEvent(mob: Mob, trigger: Trigger, target: Mob): Promise<Event> {
  const event = new Event(mob, trigger)
  for (const skill of getSkillsByTrigger(mob, trigger)) {
    if ((await attemptSkillAction(mob, target, skill)).wasSuccessful()) {
      event.resolveWith(skill.skillType)

      return event
    }
  }
  event.skillEventResolution = Resolution.Failed

  return event
}
