import { ActionOutcome } from "../../action/actionOutcome"
import Check from "../../check/check"
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
import {getSkillActionDefinition, getSkillTable} from "../skillTable"
import { Event } from "./event"
import { Resolution } from "./resolution"

export async function getSkillsByTrigger(service: GameService, mob: Mob, trigger: Trigger) {
  const skillTable = getSkillTable(service)
  const skills = skillTable.filter(skill => skill.triggers.includes(trigger)).map(skill => skill.skillType)
  return mob.skills.filter(skill => skills.includes(skill.skillType))
}

async function attemptSkillAction(
  service: GameService, mob: Mob, trigger: Trigger, target: Mob, room: Room, skill: Skill): Promise<Response> {
  const definition = await getSkillActionDefinition(service, skill.skillType)
  const request = new Request(mob, room, new EventContext(RequestType.Event, trigger))
  if (!definition) {
    return request.respondWith(ActionOutcome.None).error("not a skill definition")
  }

  const check = await (definition.preconditions ? definition.preconditions(request, service) : Check.ok())

  return definition.action(new CheckedRequest(request, check), service)
}

export async function createSkillTriggerEvent(
  service: GameService, mob: Mob, trigger: Trigger, target: Mob, room: Room): Promise<Event> {
  const event = new Event(mob, trigger)
  const skills = await getSkillsByTrigger(service, mob, trigger)
  for (const skill of skills) {
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
  const skills = await getSkillsByTrigger(service, mob, trigger)
  for (const skill of skills) {
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
