import Event from "../event/event"
import {EventType} from "../event/eventType"
import {Skill} from "./model/skill"
import {Mob} from "../mob/model/mob"

export default class SkillEvent implements Event {
  constructor(public readonly skill: Skill, public readonly mob: Mob, public readonly rollResult: boolean) {}

  public getEventType(): EventType {
    return EventType.SkillInvoked
  }
}
