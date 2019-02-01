import Event from "../../event/event"
import {EventType} from "../../event/eventType"
import {Mob} from "../model/mob"

export default class MobEvent implements Event {
  constructor(
    private readonly eventType: EventType,
    public readonly mob: Mob,
    public readonly context: any = null) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
