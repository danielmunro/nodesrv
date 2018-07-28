import { Mob } from "../../mob/model/mob"
import { Trigger } from "../../mob/trigger"
import Attempt from "../attempt"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { getSkillAction } from "../skillCollection"
import { Event } from "./event"
import { Resolution } from "./resolution"
import { OutcomeType } from "../outcomeType"

function filterBySkillTrigger(skill: Skill, trigger: Trigger) {
  const action = getSkillAction(skill.skillType)
  if (!action) {
    return false
  }
  return action.triggers.some((skillTrigger) => {
    return skillTrigger === trigger
  })
}

function getSkillsByTrigger(mob: Mob, trigger: Trigger) {
  return mob.skills.filter((skill) => filterBySkillTrigger(skill, trigger))
}

async function attemptSkillAction(mob: Mob, target: Mob, skill: Skill): Promise<Outcome> {
  const action = getSkillAction(skill.skillType)
  if (action) {
    return await action.action(new Attempt(mob, target, skill))
  }

  return new Outcome(new Attempt(mob, target, skill), OutcomeType.Success)
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
