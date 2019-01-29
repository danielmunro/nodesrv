import Event from "../event/event"
import {EventType} from "../event/eventType"
import {Skill} from "./model/skill"

export default class SkillEvent implements Event {
  constructor(public readonly skill: Skill, public readonly rollResult: boolean) {}

  public getEventType(): EventType {
    return EventType.SkillInvoked
  }
}
