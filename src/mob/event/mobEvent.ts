import {Mob} from "../model/mob"
import Event from "../../event/event"
import {EventType} from "../../event/eventType"

export default class MobEvent implements Event {
  constructor(
    private readonly eventType: EventType,
    public readonly mob: Mob,
    public readonly context = null) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
