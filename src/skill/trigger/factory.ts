import { Mob } from "../../mob/model/mob"
import { Trigger } from "../../mob/trigger"
import Attempt from "../attempt"
import AttemptContext from "../attemptContext"
import { Skill } from "../model/skill"
import Outcome from "../outcome"
import { getSkillAction } from "../skillCollection"
import { Event } from "./event"
import { Resolution } from "./resolution"
import { Request } from "../../request/request"

function filterBySkillTrigger(skill: Skill, trigger: Trigger) {
  const action = getSkillAction(skill.skillType)
  if (!action) {
    return false
  }
  return action.triggers.some((skillTrigger) => {
    return skillTrigger === trigger
  })
}

export function getSkillsByTrigger(mob: Mob, trigger: Trigger) {
  return mob.skills.filter((skill) => filterBySkillTrigger(skill, trigger))
}

async function attemptSkillAction(mob: Mob, trigger: Trigger, target: Mob, skill: Skill): Promise<Outcome> {
  // const request = new Request()
  return getSkillAction(skill.skillType).action(new Attempt(mob, skill, new AttemptContext(trigger, target)))
}

export async function createSkillTriggerEvent(mob: Mob, trigger: Trigger, target: Mob): Promise<Event> {
  const event = new Event(mob, trigger)
  for (const skill of getSkillsByTrigger(mob, trigger)) {
    if ((await attemptSkillAction(mob, trigger, target, skill)).wasSuccessful()) {
      event.resolveWith(skill.skillType)

      return event
    }
  }
  event.skillEventResolution = Resolution.Failed

  return event
}

export async function createSkillTriggerEvents(mob: Mob, trigger: Trigger, target: Mob): Promise<Event[]> {
  const events = []
  for (const skill of getSkillsByTrigger(mob, trigger)) {
    const event = new Event(mob, trigger)
    if ((await attemptSkillAction(mob, trigger, target, skill)).wasSuccessful()) {
      event.resolveWith(skill.skillType)
    } else {
      event.skillEventResolution = Resolution.Failed
    }
    events.push(event)
  }

  return events
}
