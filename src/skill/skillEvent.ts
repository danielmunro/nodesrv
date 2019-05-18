import {EventType} from "../event/enum/eventType"
import Event from "../event/event"
import {Mob} from "../mob/model/mob"
import {Skill} from "./model/skill"

export default class SkillEvent implements Event {
  constructor(public readonly skill: Skill, public readonly mob: Mob, public readonly rollResult: boolean) {}

  public getEventType(): EventType {
    return EventType.SkillInvoked
  }
}
