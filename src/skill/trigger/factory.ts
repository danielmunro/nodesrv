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
import { getSkillActionDefinition, getSkillTable } from "../skillTable"
import { Event } from "./event"
import { Resolution } from "./resolution"

export function getSkillsByTrigger(service: GameService, mob: Mob, trigger: Trigger) {
  return []
  const definitions = getSkillTable(service)
  return mob.skills.filter(
    skill => definitions.find(d => d.skillType === skill.skillType).triggers.indexOf(trigger) > -1)
}

async function attemptSkillAction(
  service: GameService, mob: Mob, trigger: Trigger, target: Mob, room: Room, skill: Skill): Promise<Response> {
  console.log(`attempting ${skill.skillType} on trigger ${trigger}`)
  const definition = await getSkillActionDefinition(service, skill.skillType)
  const request = new Request(mob, room, new EventContext(RequestType.Event, trigger))
  if (!definition) {
    return request.respondWith(ActionOutcome.None).error("not a skill definition")
  }

  if (definition.preconditions) {
    const check = await definition.preconditions(request, service)
    return definition.action(new CheckedRequest(request, check), service)
  }

  return definition.action(request, service)
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
    console.log(`trigger ${trigger} got ${skill.skillType}`)
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
