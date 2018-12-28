import Event from "../../../event/event"
import {EventType} from "../../../event/eventType"
import {Mob} from "../../model/mob"
import {Fight} from "../fight"

export default class FightEvent implements Event {
  constructor(
    public readonly eventType: EventType,
    public readonly mob: Mob,
    public readonly fight: Fight) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
