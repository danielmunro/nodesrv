import {Mob} from "../../mob/model/mob"
import Event from "../event"
import {EventType} from "../eventType"

export default class MobEvent implements Event {
  constructor(private readonly eventType: EventType, public readonly mob: Mob) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
