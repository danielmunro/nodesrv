import { ActionOutcome } from "../../action/actionOutcome"
import CheckedRequest from "../../check/checkedRequest"
import GameService from "../../gameService/gameService"
import { Trigger } from "../../mob/enum/trigger"
import { Mob } from "../../mob/model/mob"
import EventContext from "../../request/context/eventContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import Response from "../../request/response"
import { Room } from "../../room/model/room"
import { Skill } from "../model/skill"
import { getSkillActionDefinition } from "../skillTable"
import { Event } from "./event"
import { Resolution } from "./resolution"

async function filterBySkillTrigger(service: GameService, skill: Skill, trigger: Trigger) {
  const action = await getSkillActionDefinition(service, skill.skillType)
  if (!action) {
    return false
  }
  return action.triggers.some((skillTrigger) => {
    return skillTrigger === trigger
  })
}

export function getSkillsByTrigger(service: GameService, mob: Mob, trigger: Trigger) {
  return mob.skills.filter((skill) => filterBySkillTrigger(service, skill, trigger))
}

async function attemptSkillAction(
  service: GameService, mob: Mob, trigger: Trigger, target: Mob, room: Room, skill: Skill): Promise<Response> {
  const definition = await getSkillActionDefinition(service, skill.skillType)
  const request = new Request(mob, room, new EventContext(RequestType.Event, trigger))
  if (!definition) {
    return request.respondWith(ActionOutcome.None).error("not a skill definition")
  }
  const check = await definition.preconditions(request, service)

  return definition.action(new CheckedRequest(request, check), service)
}

export async function createSkillTriggerEvent(
  service: GameService, mob: Mob, trigger: Trigger, target: Mob, room: Room): Promise<Event> {
  const event = new Event(mob, trigger)
  for (const skill of getSkillsByTrigger(service, mob, trigger)) {
    if ((await attemptSkillAction(service, mob, trigger, target, room, skill)).isSuccessful()) {
      event.resolveWith(skill.skillType)

      return event
    }
  }
  event.skillEventResolution = Resolution.Failed

  return event
}

export async function createSkillTriggerEvents(
  service: GameService, mob: Mob, trigger: Trigger, target: Mob, room: Room): Promise<Event[]> {
  const events = []
  for (const skill of getSkillsByTrigger(service, mob, trigger)) {
    const event = new Event(mob, trigger)
    if ((await attemptSkillAction(service, mob, trigger, target, room, skill)).isSuccessful()) {
      event.resolveWith(skill.skillType)
    } else {
      event.skillEventResolution = Resolution.Failed
    }
    events.push(event)
  }

  return events
}
