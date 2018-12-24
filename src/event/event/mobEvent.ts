import {Mob} from "../../mob/model/mob"
import Event from "../event"
import {EventType} from "../eventType"

export default class MobEvent implements Event {
  constructor(private readonly eventType: EventType, private readonly mob: Mob) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
