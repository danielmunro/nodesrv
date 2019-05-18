import {EventType} from "../../../event/enum/eventType"
import Event from "../../../event/event"
import {Mob} from "../../model/mob"
import {Attack} from "../attack"
import {Fight} from "../fight"

export default class FightEvent implements Event {
  constructor(
    public readonly eventType: EventType,
    public readonly mob: Mob,
    public readonly fight: Fight,
    public readonly attacks: Attack[] = []) {}

  public getEventType(): EventType {
    return this.eventType
  }
}
